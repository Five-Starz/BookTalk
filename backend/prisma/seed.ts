import { PrismaClient, Reviews, Books } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // // 유저 생성
  // const user = await prisma.users.create({
  //   data: {
  //     name: '홍길동',
  //     email: 'test@example.com',
  //     password: '1234',
  //     nickname: '길동이',
  //   },
  // });

  // 책 생성
  const book = await prisma.books.create({
    data: {
      isbn: '1234567890',
      title: '더미책',
      author: '작가A',
      publisher: '출판사A',
      thumbnail: '',
      totalRating: 87,
    },
  });

  // 리뷰 여러 개 생성
  await prisma.reviews.createMany({
    data: [
      {
        userId: user.userId,
        isbn: book.isbn,
        content: '좋은 책이에요!',
        count: 5,
        rating: 4,
      },
      {
        userId: user.userId,
        isbn: book.isbn,
        content: '그냥 그래요.',
        count: 3,
        rating: 2,
      },
    ],
  });

  console.log('🌱 Seed data inserted!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
