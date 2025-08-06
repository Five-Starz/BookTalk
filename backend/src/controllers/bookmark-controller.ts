import { Request, Response, NextFunction } from 'express';  
import { BookmarksService } from "../services/bookmark-services";
const bookmarksService=new BookmarksService();

export class BookmakrsController{
  
  //이건 지워도 될듯한
  async findByUserAndIsbn(req: Request, res: Response, next: NextFunction):Promise<any>{
    const userId = parseInt(req.body.userId, 10);
    const isbn = req.body.isbn;
    return res.status(200).json(await bookmarksService.findByUserAndIsbn(userId,isbn));
  }

  async findById(req: Request, res: Response, next: NextFunction):Promise<any>{
    const userId=parseInt(req.params.userId, 10);
    if (isNaN(userId)) {
    console.error('유효하지 않은 userId 형식:', req.params.userId);
    return res.status(400).json({ message: '유효하지 않은 userId 형식입니다.' });
  }
    const userBookmarks= await bookmarksService.findById(userId);
    if(userBookmarks.length>0)
      return res.status(200).json(userBookmarks);
    else
      return res.status(404).json({message:"해당 유저의 북마크가 존재하지 않습니다."});
  }

  // 보고싶어요 생성
  async create(req: Request, res: Response, next: NextFunction):Promise<any>{
    const userId = req.user!.userId;
    const isbn = req.body.isbn;
    const isLiked=await bookmarksService.findByUserAndIsbn(userId,isbn)

    if(isLiked)
      return res.status(400).json({message:"이미 보고 싶어요를 눌렀습니다"});
    const createLike=await bookmarksService.create(userId,isbn);
    
    if(createLike)
      return res.status(200).json(createLike);
    else
      return res.status(400).json({message:"생성 실패"});
  }

  async delete(req: Request, res: Response, next: NextFunction){
    const userId = req.user!.userId;
    const isbn = req.body.isbn;
    const del=await bookmarksService.delete(userId,isbn);
    if(del)
      res.status(200).json({message:"삭제성공"})
    else
      res.status(400).json({message:"삭제실패"})

  }
  
  async countByIsbn(req: Request, res: Response, next: NextFunction):Promise<any>{
    const isbn = req.body.isbn;
    //return await likesService.countByReviewId(reviewId);
    res.status(200).json(await bookmarksService.countByIsbn(isbn));
  }
}