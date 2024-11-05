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
  deleteDoc,
  setDoc,
  addDoc,
  updateDoc,
  DocumentData,
  limit,
} from "firebase/firestore";
import { Post } from "../components/types";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../firebaseConfig";
import { addNotification } from "./user";

export async function toggleLike(post: Post): Promise<Post> {
  try {
    const likeRef = doc(
      FIRESTORE_DB,
      `Users/${post.userId}/Posts/${post.id}/Likes/${FIREBASE_AUTH.currentUser.uid}`
    );

    if (post.like) {
      await deleteDoc(likeRef);
    } else {
      await setDoc(likeRef, {});
      addNotification(post.userId, "like", post.id);
    }

    const updatedPost = {
      ...post,
      like: !post.like,
      numLikes: post.numLikes + (post.like ? -1 : 1),
    };

    return updatedPost;
  } catch (error) {
    console.error("Error toggling like:", error);
    return {
      ...post,
      like: !post.like,
    };
  }
}

export async function getUserPost(
  userId: string,
  postId: string
): Promise<Post> {
  try {
    const userPostDocRef = doc(FIRESTORE_DB, `Users/${userId}/Posts/${postId}`);
    const userPostSnapshot = await getDoc(userPostDocRef);
    const userLikeDocRef = doc(
      FIRESTORE_DB,
      `Users/${userId}/Posts/${postId}/Likes/${FIREBASE_AUTH.currentUser.uid}`
    );

    const userLikeSnapshot = await getDoc(userLikeDocRef);
    const numLikesCollection = collection(
      FIRESTORE_DB,
      `Users/${userId}/Posts/${postId}/Likes/`
    );
    const numCommentsCollection = collection(
      FIRESTORE_DB,
      `Users/${userId}/Posts/${postId}/Comments/`
    );

    const numLikesSnapshot = await getCountFromServer(numLikesCollection);
    const numCommentsSnapshot = await getCountFromServer(numCommentsCollection);

    const userPost: Post = {
      id: postId,
      urls: userPostSnapshot.data().urls,
      userId: userId,
      caption: userPostSnapshot.data().caption,
      like: userLikeSnapshot.exists(),
      numLikes: numLikesSnapshot.data().count,
      numComments: numCommentsSnapshot.data().count,
      workoutId: userPostSnapshot.data().workoutId,
      date: userPostSnapshot.data().date.toDate(),
    };
    return userPost;
  } catch (error) {
    console.error("Error fetching user post and data:", error);
  }
}
export async function getUserPostComments(userId: string, postId: string) {
  try {
    const postCommentsCollection = collection(
      FIRESTORE_DB,
      `Users/${userId}/Posts/${postId}/Comments/`
    );
    const commentsQueryRef = query(
      postCommentsCollection,
      orderBy("date", "desc")
    );
    const commentsQuerySnapshot = await getDocs(commentsQueryRef);

    const fetchUserNamePromises = commentsQuerySnapshot.docs.map(
      async (doc) => {
        const userName = await fetchCommentUserName(doc.data().userId);
        return {
          userName: userName,
          comment: doc.data().comment,
        };
      }
    );

    const comments = await Promise.all(fetchUserNamePromises);
    return comments;
  } catch (error) {
    console.error("Error fetching post comments:", error);
    return [];
  }
}

export async function addComment(comment: string, post: Post) {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const dateDay = String(currentDate.getDate()).padStart(2, "0");
  const hours = String(currentDate.getHours()).padStart(2, "0");
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");
  const formattedDateTime = `${year}-${month}-${dateDay} ${hours}:${minutes}`;
  try {
    const commentCollectionRef = collection(
      FIRESTORE_DB,
      `Users/${post.userId}/Posts/${post.id}/Comments/`
    );
    const commentDocRef = await addDoc(commentCollectionRef, {
      comment: comment,
      userId: post.userId,
      date: currentDate,
    });
    const commentDoc = doc(commentCollectionRef, commentDocRef.id);
    await updateDoc(commentDoc, {
      id: commentDocRef.id,
    });
    addNotification(post.userId, "comment", post.id);
  } catch (error) {
    console.error("Error posting comment:", error);
  }
}

export async function getUserPosts(userId: string): Promise<Post[]> {
  try {
    const userPostsCollection = collection(
      FIRESTORE_DB,
      `Users/${userId}/Posts`
    );
    const queryRef = query(userPostsCollection, orderBy("date", "desc"));
    const querySnapshot = await getDocs(queryRef);
    const followingPosts = await Promise.all(
      querySnapshot.docs.map(async (document) => {
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
        const numCommentsCollection = collection(
          FIRESTORE_DB,
          `Users/${userId}/Posts/${postData.id}/Comments/`
        );
        const numLikesSnapshot = await getCountFromServer(numLikesCollection);
        const numCommentsSnapshot = await getCountFromServer(
          numCommentsCollection
        );
        const userLikeSnapshot = await getDoc(userLikeDocRef);
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();

          return {
            id: postData.id,
            userName: userData.username,
            like: userLikeSnapshot.exists(),
            numLikes: numLikesSnapshot.data().count,
            numComments: numCommentsSnapshot.data().count,
            urls: postData.urls,
            userId: userId,
            caption: postData.caption,
            workoutId: postData.workoutId,
            date: postData.date.toDate(),
          };
        }
        return postData;
      })
    );
    return followingPosts as Post[];
  } catch (error) {
    console.error("Error fetching userPosts:", error);
  }
}
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

export async function getUserFollowersIds(): Promise<string[]> {
  const userFollowersCollection = collection(
    doc(FIRESTORE_DB, `Users/${FIREBASE_AUTH.currentUser.uid}`),
    "Followers"
  );

  const userFollowersSnapshot = await getDocs(userFollowersCollection);
  return userFollowersSnapshot.docs.map((doc) => doc.id);
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
      const numCommentsCollection = collection(
        FIRESTORE_DB,
        `Users/${postData.userId}/Posts/${postData.id}/Comments/`
      );
      const numLikesSnapshot = await getCountFromServer(numLikesCollection);
      const numCommentsSnapshot = await getCountFromServer(
        numCommentsCollection
      );
      const userLikeSnapshot = await getDoc(userLikeDocRef);
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();

        return {
          id: postData.id,
          userName: userData.username,
          like: userLikeSnapshot.exists(),
          numLikes: numLikesSnapshot.data().count,
          numComments: numCommentsSnapshot.data().count,
          urls: postData.urls,
          userId: userId,
          caption: postData.caption,
          workoutId: postData.workoutId,
          date: postData.date.toDate(),
        };
      }
      return postData;
    })
  );

  return followingPosts as Post[];
}

async function fetchCommentUserName(userId) {
  const userDocRef = doc(FIRESTORE_DB, `Users/${userId}`);
  const userDocSnapshot = await getDoc(userDocRef);
  return userDocSnapshot.data().username;
}
