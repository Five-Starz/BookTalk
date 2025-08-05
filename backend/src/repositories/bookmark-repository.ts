import { Bookmarks,Books } from "@prisma/client";
import { prisma } from "../utils/prisma";

export class BookmarksRepository{

   //특정 유저 검색
   async findById(userId:number):Promise<Bookmarks[]>{
     return await prisma.bookmarks.findMany({
       where:{
         userId,
       }
     });
   }; 

  //특정 책에 좋아요 누른 특정 사용자 검색 (존재하면 T 아니면 F)
  async findByUserAndIsbn(userId:number, isbn:string):Promise<boolean>{    
    return await prisma.bookmarks.findUnique({
      where:
        {userId_isbn:{userId,isbn}
      }}) 
      ? true : false;
  };

  //근데 한번 눌렀으면 또 못누르게 설정을 해야하는데 findByUserAndReview검색 후에 없으면 생성되도록 설정해야 함
  async create(userId:number, isbn:string):Promise<Bookmarks>{
    await prisma.books.update({
      where:{isbn},
      data:{
        bookmarkCount:{increment:1} 
      }
    });
    return await prisma.bookmarks.create({
      data:{userId,isbn}
    });
  };
  
  async delete(userId:number, isbn:string):Promise<boolean>{
    const isLike=await this.findByUserAndIsbn(userId,isbn);
    if(!isLike)
      throw new Error("해당 책에 보고싶어요를 누른 적이 없습니다.")
    const deleteLike=await prisma.bookmarks.delete({
      where:{
        userId_isbn:{
          userId,isbn
        }
      }
    });
    if(deleteLike){
      await prisma.books.update({
        where:{isbn},
        data:{
          bookmarkCount:{decrement:1} 
        }
      });
      return true;
    }else
      return false;
  };  

  //특정 책 좋아요 개수
  async countByIsbn(isbn:string):Promise<number>{
    return await prisma.bookmarks.count({
      where: {
        isbn
      }
    });
  };
};