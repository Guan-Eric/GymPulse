import {
  collection,
  doc,
  getDocs,
  query,
  collectionGroup,
  orderBy,
  where,
  getDoc,
  getCountFromServer,
} from "firebase/firestore";
import { Post } from "../components/types";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../firebaseConfig";

export async function getFeed(): Promise<Post[]> {
  try {
    const followingUserIds = await getUserFollowingIds();

    if (followingUserIds.length > 0) {
      const postsPromises = followingUserIds.map((userId) =>
        getFollowingUserPosts(userId)
      );

      const followingPosts = await Promise.all(postsPromises);

      return followingPosts.flat();
    }
  } catch (error) {
    console.error("Error fetching feed:", error);
    throw error;
  }
}

async function getUserFollowingIds(): Promise<string[]> {
  const userFollowingCollection = collection(
    doc(FIRESTORE_DB, `Users/${FIREBASE_AUTH.currentUser.uid}`),
    "Following"
  );

  const userFollowingSnapshot = await getDocs(userFollowingCollection);
  return userFollowingSnapshot.docs.map((doc) => doc.id);
}

async function getFollowingUserPosts(userId: string): Promise<Post[]> {
  const followingUserPostsQuery = query(
    collectionGroup(FIRESTORE_DB, "Posts"),
    orderBy("date", "desc"),
    where("userId", "==", userId)
  );

  const followingUserPostsSnapshot = await getDocs(followingUserPostsQuery);

  const followingPosts = await Promise.all(
    followingUserPostsSnapshot.docs.map(async (document) => {
      const postData = document.data();
      const userDocRef = doc(FIRESTORE_DB, `Users/${postData.userId}`);
      const userDocSnapshot = await getDoc(userDocRef);
      const userLikeDocRef = doc(
        FIRESTORE_DB,
        `Users/${postData.userId}/Posts/${postData.id}/Likes/${FIREBASE_AUTH.currentUser.uid}`
      );
      const numLikesCollection = collection(
        FIRESTORE_DB,
        `Users/${postData.userId}/Posts/${postData.id}/Likes/`
      );
      const numLikesSnapshot = await getCountFromServer(numLikesCollection);
      const userLikeSnapshot = await getDoc(userLikeDocRef);
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();

        return {
          ...postData,
          userName: userData.name,
          like: userLikeSnapshot.exists(),
          numLikes: numLikesSnapshot.data().count,
        };
      }
      return postData;
    })
  );

  return followingPosts as Post[];
}
