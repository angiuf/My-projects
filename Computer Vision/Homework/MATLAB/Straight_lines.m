
BW = M;

% Create hough trasform using binary image
[H,T,R] = hough(BW);
figure(8);
imshow(H,[],'XData',T,'YData',R,...
            'InitialMagnification','fit');
xlabel('\theta'), ylabel('\rho'),title('Hough trasform');
axis on, axis normal, hold on;
colormap(gca,hot);

% Find peaks
P = houghpeaks((H), 200, 'Theta', T, 'Threshold', 0.05 * max(H(:)));  
x = T(P(:,2)); y = R(P(:,1));
plot(x,y,'s','color','white');

% Find lines and plot them
lines = houghlines(BW,T,R,P,'FillGap',10,'MinLength',200);
figure(9), imshow(I),title('Lines extracted'), hold on
for k = 1:length(lines)
   xy = [lines(k).point1; lines(k).point2];
   plot(xy(:,1),xy(:,2),'LineWidth',1,'Color','green');

   % Plot beginnings and ends of lines
   plot(xy(1,1),xy(1,2),'x','LineWidth',1,'Color','yellow');
   plot(xy(2,1),xy(2,2),'x','LineWidth',1,'Color','red');

end