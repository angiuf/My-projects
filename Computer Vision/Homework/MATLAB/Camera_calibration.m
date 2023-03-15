clear;
close all;
clc;

I = imread("Villa image 2.png");
imshow(I), title("Original image");
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

% Compute v as the intersection of the 2 lines
v = cross(cross(a,b), cross(c,d));

%Normalize v
v = v./v(3);

%Plot v and the lines

text(v(1)+x_disc, v(2)+y_disc, 'v', 'FontSize', FNT_SZ, 'Color', 'b');
plot(v(1), v(2), 'b', 'MarkerSize', PNT_SZ);
plot([a(1) v(1)], [a(2) v(2)], 'b');
plot([c(1) v(1)], [c(2) v(2)], 'b');


% Take the other points
e = [99, 1.3650e+03, 1]';
f = [960, 1.34e+03, 1]';

%plot the points on the image
text(e(1)+x_disc, e(2)+y_disc, 'e', 'FontSize', FNT_SZ, 'Color', 'y');
text(f(1)+x_disc, f(2)+y_disc, 'f', 'FontSize', FNT_SZ, 'Color', 'y');
plot(e(1), e(2), 'y.', 'MarkerSize', PNT_SZ);
plot(f(1), f(2), 'y.', 'MarkerSize', PNT_SZ);

%Compute the 2 vanishing point and the image of the line at the infinity
v1 = cross(cross(e,a), cross(f,c));
v2 = cross(cross(e,f), cross(a,c));
v1 = v1./v1(3);
v2 = v2./v2(3);

% Plot v1 and v2
text(v1(1)+x_disc, v1(2)+y_disc, 'v1', 'FontSize', FNT_SZ, 'Color', 'y');
text(v2(1)+x_disc, v2(2)+y_disc, 'v2', 'FontSize', FNT_SZ, 'Color', 'b');
plot(v1(1), v1(2), 'y', 'MarkerSize', PNT_SZ);
plot(v2(1), v2(2), 'b', 'MarkerSize', PNT_SZ);

plot([e(1) v1(1)], [e(2) v1(2)], 'b');
plot([f(1) v1(1)], [f(2) v1(2)], 'b');
plot([a(1) v2(1)], [a(2) v2(2)], 'b');
plot([e(1) v2(1)], [e(2) v2(2)], 'b');
plot([v1(1) v2(1)], [v1(2) v2(2)], 'b');

%Line at the infinity
linf = cross(v1,v2);


%H of metric rectification from previous point
Hr = [1.31145040302845 -0.629152571724488  0;
                     0  1.403360600698     0;
     -2.41854176634543e-05 -0.000835517704230148  1];

%Take each column of the matrix H

Hr_inv = inv(Hr);

h1 = Hr_inv(:,1);
h2 = Hr_inv(:,2);
h3 = Hr_inv(:,3);

syms a b c d;
omega = [a 0 b; 0 1 c; b c d];

l_1 = linf(1,1);
l_2 = linf(2,1);
l_3 = linf(3,1);
lx = [0 -l_3 l_2; l_3 0 -l_1; -l_2 l_1 0];

eqn_omega = [lx(1,:)*omega*v == 0, lx(2,:)*omega*v == 0];
eqn_linf = [h1.' * omega * h2 == 0, h1.' * omega * h1 == h2.' * omega * h2];
eqns = [eqn_omega, eqn_linf];
W = solve(eqns, [a,b,c,d]);
IAC = double([W.a 0 W.b; 0 1 W.c; W.b W.c W.d]);


IAC

K = chol(inv(IAC))


