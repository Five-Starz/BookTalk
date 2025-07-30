import { Comments,CommentStatus } from '@prisma/client';
import {prisma} from '../utils/prisma/index';

export class CommentsRepository{

  //특정 유저 검색
  async findById(userId:number):Promise<Comments[]>{
    return await prisma.comments.findMany({
      where:{
        userId,
        status:CommentStatus.NORMAL //NORMAL인 것만 출력
      }
    });
  };

  //댓글을 작성한 유저 검색
  async findByCommentIdForUserId(commentId:number){
    return await prisma.comments.findFirst({
      where:{
        commentId,
        status:CommentStatus.NORMAL  //NORMAL인 것만 출력
      },
      select:{userId:true}
    });
  };

  //댓글 생성
  async creatComment(userId:number,reviewId:number,content:string,parentId?:number|null):Promise<Comments>{
    return await prisma.comments.create({
    data:{userId,reviewId,content,parentId}
    });    
  };

  //특정 리뷰의 모든 댓글 조회
  async findByReviewId(reviewId:number):Promise<Comments[]>{
    return prisma.comments.findMany({
      where:{
        reviewId,
        //status:CommentStatus.NORMAL  //NORMAL인 것만 출력
      },
      include:{
        users:{
          select:{
            userId: true,
            nickname: true,
          }
        },
        replies:{
          where: {
            //status: CommentStatus.NORMAL  //NORMAL인 것만 출력
          },
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
    });
  };

  //만약 수정된다면 create 날자와 update 날짜 비교해서 다를시에 (수정됨) 뜨게 하면 될듯? / 아니면 update는 처음에 등록이 안되게 해서 등록될시에 뜨게 한다든지
  //delete는 수정 불가능하게 설정하면 될듯하다(아니면 프론트에서 delete는 삭제 버튼을 못 누르게 설정하든가)
  async updateComment(userId:number,commentId:number,content:string):Promise<Comments>{
    const CommentUserId=await this.findByCommentIdForUserId(commentId)
    if(!CommentUserId){
      throw new Error('댓글이 존재하지 않습니다?'); //대충 만든 에러
    };    
    if(userId!==CommentUserId.userId){
      throw new Error('사용자가 일치하지 않습니다.');
    };

    return await prisma.comments.update({
      where:{commentId},
      data:{content}
    });
  };

  //현재 onDelete 때문에 대댓글도 삭제되게 되어 있는데 그대로 할지 지울지 생각해보자 / 근데 그냥 지우는게 나을듯?
  //->일단 enum으로 상태 변경으로 수정
  async deleteComment(userId:number,commentId:number):Promise<boolean>{ 
    const CommentUserId=await this.findByCommentIdForUserId(commentId);
    if(!CommentUserId){
      throw new Error('댓글이 존재하지 않습니다?') //대충 만든 에러
    };    
    if(userId!==CommentUserId.userId){
      throw new Error('사용자가 일치하지 않습니다.')
    };

    const deleteComment=await prisma.comments.update({
      where:{commentId},
      data:{content:'[삭제된 댓글입니다]',
        status:CommentStatus.DELETED}
    });

    if(deleteComment)
      return true;
    else
      return false;
  };

  //실제로 db에서 삭제하기
  async deleteComment2(commentId:number):Promise<boolean>{
    const deleteComment=await prisma.comments.delete({
      where:{commentId}
    });

    if(deleteComment)
      return true;
    else
      return false;
  };

  async countReviewComment(reviewId:number){
    return await prisma.comments.count({
      where:{
        reviewId,
        status:CommentStatus.NORMAL
      }
    });
  };
};

