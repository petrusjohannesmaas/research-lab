export const postImages = [
  '/post-images/post-image-1.jpg',
  '/post-images/post-image-2.jpg',
  '/post-images/post-image-3.jpg',
  '/post-images/post-image-4.jpg',
  '/post-images/post-image-5.jpg',
  '/post-images/post-image-6.jpg',
  '/post-images/post-image-7.jpg',
  '/post-images/post-image-8.jpg',
  '/post-images/post-image-9.jpg',
  '/post-images/post-image-10.jpg',
  '/post-images/post-image-11.jpg',
  '/post-images/post-image-12.jpg',
];

export const getRandomImage = () => {
  return postImages[Math.floor(Math.random() * postImages.length)];
};
