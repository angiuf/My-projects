dx = [-1 0 1; -1 0 1; -1 0 1];   % Derivative masks
dy = dx';

Ix = conv2(y, dx, 'same');      % Image derivatives
Iy = conv2(y, dy, 'same');

% set the parameter for Gaussian convolution used in Harris Corner Detector
SIGMA_gaussian=1
g = fspecial('gaussian',max(1,fix(3*SIGMA_gaussian)+1), SIGMA_gaussian);

Ix2 = conv2(Ix.^2, g, 'same'); % Smoothed squared image derivatives
Iy2 = conv2(Iy.^2, g, 'same');
Ixy = conv2(Ix.*Iy, g, 'same');

% cim = det(M) - k trace(M)^2.
k = 0.04;
cim = (Ix2.*Iy2 - Ixy.^2) - k * (Ix2 + Iy2);

BORDER=20;
cim(1:BORDER,:)=0;
cim(end-BORDER:end,:)=0;
cim(:,end-BORDER:end)=0;
cim(:,1:BORDER)=0;

T=mean(cim(:));
CIM=cim;
CIM(find(cim<T))=0;
% similarly one could use the Otzu method

figure(5), imshow(CIM,[]),title('Harris measure');
colorbar

figure(6), mesh(CIM),title('Harris measure with peaks');
colorbar

% this value needs to be adjsted also depending on the image size
support=true(31);
% compute maximum over a square neighbor of size 31 x 31
maxima=ordfilt2(CIM,sum(support(:)),support);
% determine the locations where the max over the neigh or 31 x 31 corresponds to the cim values
[loc_x,loc_y]=find((cim==maxima).*(CIM>0));
indx = find((cim==maxima).*(CIM>0));

figure(6),
hold on
plot3(loc_y,loc_x, cim(indx), 'g+', 'LineWidth', 2)
hold off
view(gca,[-66.3 42.8]);


% draw a cross on the image in the local maxima
figure(7), imshow(I),title("Corners extracted"), hold on,
plot(loc_y,loc_x,'g+', 'LineWidth', 1)