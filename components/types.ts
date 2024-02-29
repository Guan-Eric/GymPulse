export interface User {
    name: string;
    bio: string;
    id: string,
  }
  
  export interface Post {
    id: string;
    url: string;
    userId: string;
    caption: string,
    userName: string,
    like: boolean,
    numLikes: number,
  }

  export interface Workout {
    id: string,
    name: string,
    duration: number,
    date: string,
    exercises: Exercise[],
  }

  export interface Exercise {
    id: string,
    name: string,
    sets: [
        
    ],
    cardio: boolean,
  }
  