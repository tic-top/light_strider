#ifndef P2_NEW_PROJECT2_H
#define P2_NEW_PROJECT2_H
#include <string.h>
#include <stdio.h>
#include <math.h>
#include <stdlib.h>
#include <time.h>
#include <malloc.h>
#define INT sizeof(int)

typedef struct _p{ //player struct
    int score;//the score
    struct _p* left;//the player on the left
    struct _p* right;// the player on the right
    int cntelem;
    int *elem;// the card in the hand
} p;
//use qsort to sort the cards in the players hand

typedef struct _c{ // card type
    char *suit;// the suit of the card
    int rank;// the rank of the card
} cao;//form a vector from 0 to 51
//suit and the rank can be think finally

int cmpINT(const void *a,const void *b);
void readnum(int *n,int *r,int *d,int *c);
void welcom(FILE *fp,int r,int d,int n);
void givecard(p* temp,int *stock,int *stockcnt,int *discard,int *cntdis,int c);
p* initialize();
void insert(p** head);
void freeplayers(p* playernow);
void printplayer(p *player,int x);
void printshuffle(p* player,FILE *fp);
void printcc(int init,FILE *fp);
void determine(p** head,int* discard,int* stock,int *cntstock,int *cntdis,int n,FILE *fp);
void deletecard(p* head,int command,int *discard,int *cntdis);
void swap(int **stock,int *cntstock,int **discard,int *cntdis);
void shuffle(int *stock,int cntstock);
int checkpro(p* head,int init);
int check(p *head,int command,int *init,int accumulate );
void implement(p *head,int command,int* init,int *accumulate,int *clock,int *jump);
void turnaroundmore(int *jump,int* whoisplay,int n,p** head,int clock);
void freedom(p* head);
void clear(p* head);
void help();
void demo(int n,int c,int d,int r);
void projectbegin();
//void finalfree();

#endif //P2_NEW_PROJECT2_H
