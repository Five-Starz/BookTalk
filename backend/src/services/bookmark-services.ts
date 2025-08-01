import { Bookmarks } from "@prisma/client";
import { BookmarksRepository } from "../repositories/bookmark-repository";
const bookmarksRepository=new BookmarksRepository();

export class BookmarksService{

  async findById(userId:number):Promise<Bookmarks[]>{
    return await bookmarksRepository.findById(userId);
  };

  async findByUserAndIsbn(userId:number, isbn:string):Promise<boolean>{
    return await bookmarksRepository.findByUserAndIsbn(userId,isbn)
  }
  async create(userId:number, isbn:string):Promise<Bookmarks>{
    return await bookmarksRepository.create(userId,isbn)
  }
  async delete(userId:number, isbn:string):Promise<boolean>{
    return await bookmarksRepository.delete(userId,isbn)
  }
  async countByIsbn(isbn:string):Promise<number>{
    return await bookmarksRepository.countByIsbn(isbn)
  }

};
