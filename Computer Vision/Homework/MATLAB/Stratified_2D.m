close all
clear
clc

% Load image
I = imread("Villa image 2.png");
figure(1);
imshow(I), title("Original image");
hold on;

% Set global variables
FNT_SZ = 10;
PNT_SZ = 10;
x_disc = 4;
y_disc = 10;
 
% Take all main points by hand
A = [100.6698, 1.3690e+03, 1]';
B = [107.3153, 1.3665e+03, 1]';
C = [165.1699, 1.3644e+03, 1]';
D = [176.8972, 1.3546e+03, 1]';
E = [201.9849, 1.3129e+03, 1]';
F = [508.6777, 1.3041e+03, 1]';
G = [802.5925, 1.2952e+03, 1]';
H = [883.1107, 1.3340e+03, 1]';
L = [903.1667, 1.3409e+03, 1]';
M = [953.1747, 1.3402e+03, 1]';
N = [962.6749, 1.3434e+03, 1]';
P = [335.0041, 1.3067e+03, 1]';
Q = [225.0074, 1.3579e+03, 1]';
R = [269.6324, 1.3174e+03, 1]';
S = [746.1883, 1.3013e+03, 1]';
T = [841.6039, 1.3381e+03, 1]';

% Plot them with their names
text(A(1)+x_disc, A(2)+y_disc, 'A', 'FontSize', FNT_SZ, 'Color', 'y');
text(B(1)+x_disc, B(2)+y_disc, 'B', 'FontSize', FNT_SZ, 'Color', 'y');
text(C(1)+x_disc, C(2)+y_disc, 'C', 'FontSize', FNT_SZ, 'Color', 'y');
text(D(1)+x_disc, D(2)+y_disc, 'D', 'FontSize', FNT_SZ, 'Color', 'y');
text(E(1)+x_disc, E(2)+y_disc, 'E', 'FontSize', FNT_SZ, 'Color', 'y');
text(F(1)+x_disc, F(2)+y_disc, 'F', 'FontSize', FNT_SZ, 'Color', 'y');
text(G(1)+x_disc, G(2)+y_disc, 'G', 'FontSize', FNT_SZ, 'Color', 'y');
text(H(1)+x_disc, H(2)+y_disc, 'H', 'FontSize', FNT_SZ, 'Color', 'y');
text(L(1)+x_disc, L(2)+y_disc, 'L', 'FontSize', FNT_SZ, 'Color', 'y');
text(M(1)+x_disc, M(2)+y_disc, 'M', 'FontSize', FNT_SZ, 'Color', 'y');
text(N(1)+x_disc, N(2)+y_disc, 'N', 'FontSize', FNT_SZ, 'Color', 'y');
text(P(1)+x_disc, P(2)+y_disc, 'P', 'FontSize', FNT_SZ, 'Color', 'y');
text(Q(1)+x_disc, Q(2)+y_disc, 'Q', 'FontSize', FNT_SZ, 'Color', 'y');
text(R(1)+x_disc, P(2)+y_disc, 'R', 'FontSize', FNT_SZ, 'Color', 'y');
text(S(1)+x_disc, S(2)+y_disc, 'S', 'FontSize', FNT_SZ, 'Color', 'y');
text(T(1)+x_disc, T(2)+y_disc, 'T', 'FontSize', FNT_SZ, 'Color', 'y');

plot(A(1), A(2), 'y.', 'MarkerSize', PNT_SZ);
plot(B(1), B(2), 'y.', 'MarkerSize', PNT_SZ);
plot(C(1), C(2), 'y.', 'MarkerSize', PNT_SZ);
plot(D(1), D(2), 'y.', 'MarkerSize', PNT_SZ);
plot(E(1), E(2), 'y.', 'MarkerSize', PNT_SZ);
plot(F(1), F(2), 'y.', 'MarkerSize', PNT_SZ);
plot(G(1), G(2), 'y.', 'MarkerSize', PNT_SZ);
plot(H(1), H(2), 'y.', 'MarkerSize', PNT_SZ);
plot(L(1), L(2), 'y.', 'MarkerSize', PNT_SZ);
plot(M(1), M(2), 'y.', 'MarkerSize', PNT_SZ);
plot(N(1), N(2), 'y.', 'MarkerSize', PNT_SZ);
plot(P(1), P(2), 'y.', 'MarkerSize', PNT_SZ);
plot(Q(1), Q(2), 'y.', 'MarkerSize', PNT_SZ);
plot(R(1), R(2), 'y.', 'MarkerSize', PNT_SZ);
plot(S(1), S(2), 'y.', 'MarkerSize', PNT_SZ);
plot(T(1), T(2), 'y.', 'MarkerSize', PNT_SZ);

% Compute the lines crossing 2 points
lae = cross(A,E);
lan = cross(A,N);
lbc = cross(B,C);
lcd = cross(C,D);
lbe = cross(B,E);
lef = cross(E,F);
leg = cross(E,G);
lfg = cross(F,G);
lgm = cross(G,M);
lhl = cross(H,L);
llm = cross(L,M);
lnp = cross(N,P);
lgn = cross(G,N);
lbm = cross(B,M);
lqr = cross(Q,R);
lrs = cross(R,S);
lst = cross(S,T);
ltq = cross(T,Q);
lap = cross(A,P);

% Take the 2 vanishing points by intersecting pairs of parallel lines
v1 = cross(lae, lgn);
v1 = v1./v1(3);
v2 = cross(leg, lan);
v2 = v2./v2(3);

% Compute the image of the line at infinity
imLinfty = cross(v1,v2);
imLinfty = imLinfty./(imLinfty(3));

% Plot the vanishing points and lines joining to them
plot([A(1), v2(1)], [A(2) v2(2)], 'b');
plot([E(1), v2(1)], [E(2), v2(2)], 'b');
plot([A(1), v1(1)], [A(2), v1(2)], 'b');
plot([N(1), v1(1)], [N(2), v1(2)], 'b');
plot([v1(1), v2(1)], [v1(2), v2(2)], 'b');

text(v1(1), v1(2), 'v1', 'FontSize', FNT_SZ, 'Color', 'y');
text(v2(1), v2(2), 'v2', 'FontSize', FNT_SZ, 'Color', 'y');


% Compute the affine rectification matrix and print it
Har = [eye(2),zeros(2,1); imLinfty(:).']

% Show the main points after the affine rectifiaction
figure();
title("Points after affine rectification");
hold on;
A1 = Har*A;
E1 = Har*E;
G1 = Har*G;
N1 = Har*N;
Q1 = Har*Q;
R1 = Har*R;
S1 = Har*S;
T1 = Har*T;

A1 = A1./A1(3);
E1 = E1./E1(3);
G1 = G1./G1(3);
N1 = N1./N1(3);
Q1 = Q1./Q1(3);
R1 = R1./R1(3);
S1 = S1./S1(3);
T1 = T1./T1(3);

plot([A1(1), E1(1)], [A1(2) E1(2)], 'b');
plot([E1(1), G1(1)], [E1(2), G1(2)], 'b');
plot([G1(1), N1(1)], [G1(2), N1(2)], 'b');
plot([N1(1), A1(1)], [N1(2), A1(2)], 'b');
plot([Q1(1), R1(1)], [Q1(2), R1(2)], 'b');
plot([R1(1), S1(1)], [R1(2), S1(2)], 'b');
plot([S1(1), T1(1)], [S1(2), T1(2)], 'b');
plot([T1(1), Q1(1)], [T1(2), Q1(2)], 'b');
text(A1(1)+x_disc, A1(2)+y_disc, 'A1', 'FontSize', FNT_SZ, 'Color', 'b');
text(E1(1)+x_disc, E1(2)+y_disc, 'E1', 'FontSize', FNT_SZ, 'Color', 'b');
text(G1(1)+x_disc, G1(2)+y_disc, 'G1', 'FontSize', FNT_SZ, 'Color', 'b');
text(N1(1)+x_disc, N1(2)+y_disc, 'N1', 'FontSize', FNT_SZ, 'Color', 'b');
text(Q1(1)+x_disc, Q1(2)+y_disc, 'Q1', 'FontSize', FNT_SZ, 'Color', 'b');
text(R1(1)+x_disc, R1(2)+y_disc, 'R1', 'FontSize', FNT_SZ, 'Color', 'b');
text(S1(1)+x_disc, S1(2)+y_disc, 'S1', 'FontSize', FNT_SZ, 'Color', 'b');
text(T1(1)+x_disc, T1(2)+y_disc, 'T1', 'FontSize', FNT_SZ, 'Color', 'b');

% Trasform the original image
tform = projective2d(Har.');
J = imwarp(I, tform);
figure();
imshow(J);
title("Affine reconstructed image");
hold on;

% Take 4 points by hand and show them on the affine image
A1 = [5342.89, 8310.39, 1].';
B1 = [5587.77, 9001.45, 1].';
C1 = [6746.04, 9094.59, 1].';
D1 = [6507.18, 8411.05, 1].';

plot(A1(1), A1(2), 'y.', 'MarkerSize', PNT_SZ);
plot(B1(1), B1(2), 'y.', 'MarkerSize', PNT_SZ);
plot(C1(1), C1(2), 'y.', 'MarkerSize', PNT_SZ);
plot(D1(1), D1(2), 'y.', 'MarkerSize', PNT_SZ);

% Find the lines joining the points. These lines are 2 pair of orthogonal
% lines
l1 = cross(A1,B1);
m1 = cross(B1,C1);
s1 = cross(C1,D1);
t1 = cross(D1,A1);

l1 = l1./l1(3);
m1 = m1./m1(3);
s1 = s1./s1(3);
t1 = t1./t1(3);

% Set the constraint for the submatrix St (the lines must be orthogonal in pairs)
St(1,:) = [l1(1)*m1(1),0.5*(l1(1)*m1(2)+l1(2)*m1(1)),l1(2)*m1(2)];
St(2,:) = [s1(1)*t1(1),0.5*(s1(1)*t1(2)+s1(2)*t1(1)),s1(2)*t1(2)];

% Execute svd to find the solutions of the matrix of the equations
[~,~,v] = svd(St); %
sol = v(:,end); %sol = (a,b,c)  [a,b/2; b/2,c];
St = [sol(1)  , sol(2)/2;
    sol(2)/2, sol(3)];

% Compute the image of the dual conic to the circular points, with St
imDCCP = [St,zeros(2,1); zeros(1,3)]; % the image of the circular points
[U,D,V] = svd(St);
Arect = U*sqrt(D)*V';
Ha = eye(3);
Ha(1,1) = Arect(1,1);
Ha(1,2) = Arect(1,2);
Ha(2,1) = Arect(2,1);
Ha(2,2) = Arect(2,2);

K = chol(St);
Ha = [K, zeros(2,1); zeros(1,2), 1];
Hsr = inv(Ha)

% Compute and plot points for metric rectification
figure();
title("Points after metric rectification");
hold on;
A2 = Hsr*A1;
B2 = Hsr*B1;
C2 = Hsr*C1;
D2 = Hsr*D1;

A2 = A2./A2(3);
B2 = B2./B2(3);
C2 = C2./C2(3);
D2 = D2./D2(3);

plot([A2(1), B2(1)], [A2(2) B2(2)], 'b');
plot([B2(1), C2(1)], [B2(2), C2(2)], 'b');
plot([C2(1), D2(1)], [C2(2), D2(2)], 'b');
plot([D2(1), A2(1)], [D2(2), A2(2)], 'b');
text(A2(1)+x_disc, A2(2)+y_disc, 'A2', 'FontSize', FNT_SZ, 'Color', 'b');
text(B2(1)+x_disc, B2(2)+y_disc, 'B2', 'FontSize', FNT_SZ, 'Color', 'b');
text(C2(1)+x_disc, C2(2)+y_disc, 'C2', 'FontSize', FNT_SZ, 'Color', 'b');
text(D2(1)+x_disc, D2(2)+y_disc, 'D2', 'FontSize', FNT_SZ, 'Color', 'b');

% Compute the ratio between the 2 facades
s1 = distance(A2,B2);
s2 = distance(B2,C2);
r = s1/s2;
fprintf("Facade ratio is %2.4f\n", r);

% Apply rectification to image and show it
tform = projective2d(Hsr');
J2 = imwarp(J, tform);
figure();
imshow(J2), title("Metric reconstructed image");

% Print the rectification matrix
Hrect = Hsr*Har