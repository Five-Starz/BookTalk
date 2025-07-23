import { Comments } from '@prisma/client';
import {prisma} from '../utils/prisma/index';

export class CommentsRepository{

  //특정 유저 검색
  async findById(userId:number):Promise<Comments|null>{
    return await prisma.comments.findFirst({
      where:{userId}
    })
  };

  //댓글 생성
  async creatComment(userId:number,reviewId:number,content:string,parentId?:number|null):Promise<Comments>{

      return await prisma.comments.create({
      data:{userId,reviewId,content,parentId}
      })
    
  };

  //특정 리뷰의 모든 댓글 조회
  async findByReviewId(reviewId:number){
    return prisma.comments.findMany({
      where:{
        reviewId,
        parentId: null
      },
      include:{
        users:{
          select:{
            userId: true,
            nickname: true,
          }
        },
        replies:{
          include:{
            users: {
              select: {
                userId: true,
                nickname: true,
              },
            },
          },
          orderBy:{//대댓글 정렬 기준
            createdAt:'asc'
          }
        }
      },
      orderBy: { //최상위 댓글 정렬 기준
        createdAt: 'asc',
      }
    })
  };

  //만약 수정된다면 create 날자와 update 날짜 비교해서 다를시에 (수정됨) 뜨게 하면 될듯? / 아니면 update는 처음에 등록이 안되게 해서 등록될시에 뜨게 한다든지
  async updateComment(commentId:number,content:string){
    await prisma.comments.update({
      where:{commentId},
      data:{content}
    })
  };

  async deleteComment(commentId:number){ //현재 onDelete 때문에 대댓글도 삭제되게 되어 있는데 그대로 할지 지울지 생각해보자 / 근데 그냥 지우는게 나을듯?
    await prisma.comments.delete({
      where:{commentId}
    })
  };
};

