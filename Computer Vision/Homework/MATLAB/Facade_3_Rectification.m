clear;
close all;
clc;

I = imread("Villa image 2.png");
figure(1);
imshow(I),title("Original image");
hold on;

FNT_SZ = 10;
PNT_SZ = 10;
x_disc = 4;
y_disc = 10;

% The take the coordinates of the 4 point of the facade 3 (normal to the
% reconstructed one)
a = [202, 1.3070e+03, 1]';
b = [279, 0.4840e+03, 1]';
c = [803, 1.2930e+03, 1]';
d = [726, 0.5030e+03, 1]';

% The points are shown in the image
text(a(1)+x_disc, a(2)+y_disc, 'a', 'FontSize', FNT_SZ, 'Color', 'y');
text(b(1)+x_disc, b(2)+y_disc, 'b', 'FontSize', FNT_SZ, 'Color', 'y');
text(c(1)+x_disc, c(2)+y_disc, 'c', 'FontSize', FNT_SZ, 'Color', 'y');
text(d(1)+x_disc, d(2)+y_disc, 'd', 'FontSize', FNT_SZ, 'Color', 'y');

plot(a(1), a(2), 'y.', 'MarkerSize', PNT_SZ);
plot(b(1), b(2), 'y.', 'MarkerSize', PNT_SZ);
plot(c(1), c(2), 'y.', 'MarkerSize', PNT_SZ);
plot(d(1), d(2), 'y.', 'MarkerSize', PNT_SZ);

% Compute v1 and v2 as the intersection of the 2 lines
v1 = cross(cross(a,b), cross(c,d));
v2 = cross(cross(b,d), cross(a,c));

%Normalize v1 and v2
v1 = v1./v1(3);
v2 = v2./v2(3);

text(v1(1)+x_disc, v1(2)+y_disc, 'v1', 'FontSize', FNT_SZ, 'Color', 'b');
plot(v1(1), v1(2), 'b', 'MarkerSize', PNT_SZ);
plot([a(1) v1(1)], [a(2) v1(2)], 'b');
plot([c(1) v1(1)], [c(2) v1(2)], 'b');

text(v2(1)+x_disc, v2(2)+y_disc, 'v2', 'FontSize', FNT_SZ, 'Color', 'b');
plot(v2(1), v2(2), 'b', 'MarkerSize', PNT_SZ);
plot([a(1) v2(1)], [a(2) v2(2)], 'b');
plot([b(1) v2(1)], [b(2) v2(2)], 'b');

% Compute the image of the line at infinity
linf = cross(v1,v2);
linf = linf./linf(3);

plot([v1(1) v2(1)], [v1(2) v2(2)], 'b');

% Take the image of the absolute conic from K
K = [1.96710794530133         0.647934128046524      0.000638551259399212;
                         0          1.66562764029174       0.00104982720240096;
                         0                         0      0.000788138251943832];
% Compute IAC
IAC = inv(K'*K);

% Compute the image of circular points
syms 'x';
syms 'y';

% Set up the equation to obtain I' and J'
eqn1 = [IAC(1,1)*x^2+2*IAC(1,2)*x*y+IAC(2,2)*y^2+2*IAC(1,3)*x+2*IAC(2,3)*y+IAC(3,3) == 0];
eqn2 = [linf(1)*x+linf(2)*y+linf(3) == 0];

% Solve the equations and find I' and J'
eqns = [eqn1, eqn2];
X = solve(eqns, [x,y]);
Ii = double([X.x(1); X.y(1); 1]);
Ji = double([X.x(2); X.y(2); 1]);

% Build the image of the conic dual to the circular points
DCCPi = Ii*Ji.' + Ji*Ii.';
DCCPi = DCCPi ./ norm(DCCPi);

% Perform SVD to find rectification matrix
[U,D,V] = svd(DCCPi);
D(3,3) = 1;
Hrect = U*sqrt(D);
Hrect = inv(Hrect)

figure();
tform = projective2d(Hrect');
J = imwarp(I, tform);
imshow(J), title("Facade 3 rectified");

a1 = Hrect*a;
b1 = Hrect*b;
c1 = Hrect*c;
d1 = Hrect*d;

a1 = a1./a1(3)
b1 = b1./b1(3)
c1 = c1./c1(3)
d1 = d1./d1(3)

   


