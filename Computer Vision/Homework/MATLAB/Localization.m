clear
close all
clc;

x_disc = 0.1;
y_disc = 0.1;
FNT_SZ = 10;
CAMERA_HEIGHT = 1.5;

%Take the points from previous reconstruction
a_real = [-167.738734663577 ,-2291.44104559145, 1]';
b_real = [-252.058376340953, -1120.61725401267, 1]';
c_real = [-559.452744837832, -2317.51399229086, 1]';
d_real = [-643.772386515208, -1146.69020071207, 1]';

%Compute edges lenght and their aspect ratios
l1 = distance(a_real,c_real);
l2 = distance(a_real,b_real);
aspect_ratio = l1/l2;

%Assume the lenght of ab
LENGHT_AB = 1;

% Build the rectangle with the same aspect ratios
u1 = [0 0];
u2 = [0 LENGHT_AB];
u3 = [LENGHT_AB/aspect_ratio 0];
u4 = [LENGHT_AB/aspect_ratio LENGHT_AB];

% Take the same points in the original image
a = [202, 1.3070e+03, 1]';
b = [279, 0.4840e+03, 1]';
c = [803, 1.2930e+03, 1]';
d = [726, 0.5030e+03, 1]';

% Estimate the homography
H = fitgeotrans([u1; u2; u3; u4], [a(1:2).'; b(1:2).'; c(1:2).'; d(1:2).'], 'projective');
H = H.T.';

%Extract columns
h1 = H(:,1);
h2 = H(:,2);
h3 = H(:,3);

% Retrieve K from G2
K = [1.96710794530133         0.647934128046524      0.000638551259399212;
                         0          1.66562764029174       0.00104982720240096;
                         0                         0      0.000788138251943832];

% normalization factor.
lambda = 1 / norm(K \ h1);

% Compute i, j and k for the rotation matrix
i_pi = (K \ h1) * lambda;
j_pi = (K \ h2) * lambda;
k_pi = cross(i_pi,j_pi);

% Obtain rotation matrix
R = [i_pi, j_pi, k_pi];

% Use SVD to soppress noise and get an orthogonal matrix
[U, ~, V] = svd(R);
R = U * V';

% Compute the translation vector
T = (K \ (lambda * h3));

% Obtain localization matrix
location_matrix = inv([R, T;
                    zeros(1,3), 1])

camera_rotation = location_matrix(1:3,1:3);
camera_position = location_matrix(1:3, 4);

%Display camera position
figure
plotCamera('Location', camera_position, 'Orientation', camera_rotation.', 'Size', 1);
hold on
pcshow([[u2; u1; u3; u4], zeros(size([u2; u1; u4; u3],1), 1)], ...
    'red','VerticalAxisDir', 'up', 'MarkerSize', 100);

xlabel('X')
ylabel('Y')
zlabel('Z')

text(u1(1)+x_disc, u1(2)+y_disc, 'u1', 'FontSize', FNT_SZ, 'Color', 'r');
text(u2(1)+x_disc, u2(2)+y_disc, 'u2', 'FontSize', FNT_SZ, 'Color', 'r');
text(u3(1)+x_disc, u3(2)+y_disc, 'u3', 'FontSize', FNT_SZ, 'Color', 'r');
text(u4(1)+x_disc, u4(2)+y_disc, 'u4', 'FontSize', FNT_SZ, 'Color', 'r');