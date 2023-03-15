close all
clear
clc

THRESHOLD = 0.25;

disp('differentiating filters')
diffx=[1 -1]
diffy = diffx'

%smoothing filters Sobel
sx=[1 2 1 ; 1 2 1];
sy=sx';

% Build Sobel derivative filters
disp('derivative filters Sobel')
dx=conv2(sy,diffx)
dy=conv2(sx,diffy)

I =imread("Villa image 2.png");
figure(1), imshow(I),title('Original image');
y = im2double(I);
y = im2gray(y);

% compute gradient components (horizontal and vertical derivatives)
Gx=conv2(y , dx , 'same');
Gy=conv2(y , dy , 'same');

% Gradient Norm
M=sqrt(Gx.^2 + Gy.^2);
M = M >= THRESHOLD;

figure(2),imshow(M,[]),title('Edge Detected with Sobel');

% build the gradient image as a two plane image: the first plane contains horizontal derivatives, the second plane the
% vertical ones
Grad=zeros(size(y,1),size(y,2),2);
Grad(:,:,1)=Gx;
Grad(:,:,2)=Gy;

% compute Gradient norm
Norm_Grad = sqrt(Grad(: , : , 1) .^ 2 + Grad(: , : , 2) .^ 2);
BORDER = 3;

% remove boundaries as these are affected by zero padding
Norm_Grad(1 : BORDER, :) = 0;
Norm_Grad(end - BORDER : end, :) = 0;
Norm_Grad(:, 1 : BORDER) = 0;
Norm_Grad(:, end - BORDER : end) = 0;

% we change the sign of the derivative because the y axis is "increasing downwards", since in Matlab it correspodns to the row index
Dir_Grad=atand(- sign(Grad(:,:,1)).*Grad(:,:,2) ./(abs(Grad(:,:,1))+eps));

figure(3),imshow(Norm_Grad,[]),title('Norm');
figure(4),imshow(Dir_Grad,[]),title('Directions');