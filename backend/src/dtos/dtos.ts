
export interface UsersDto{
  userId:Number
  name:String   
  email:String
  password:String   
  nickname:String
  createdAt:Date
  updatedAt:Date
};


export interface ReviewsDto{
  reviewId:Number
  userId:Number
  isbn:String 
  content:String   
  count:Number
  rating:Number   
  createdAt:Date
  updatedAt:Date
};         


export interface BooksDto{
  isbn:String
  title:String
  author:String
  publisher:String
  thumbnail:String
  createdAt:Date
  totalRating:Number
};
export interface CommentsDto{
  commentId:Number
  userId:Number
  reviewId:Number
  content:String 
  createdAt:Date
  updatedAt:Date
};

export interface LikesDto{
  userId:Number
  reviewId:Number
  createdAt:Date
};