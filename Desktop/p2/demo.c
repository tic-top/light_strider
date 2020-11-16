#include "project2.h"
void demo(int n,int c,int d,int r){
    FILE* fp;
    fp=fopen("onecard.doc","w");

    srand((unsigned)time(NULL));
    if (n==-1) n=4;
    if (r==-1) r=2;
    if (d==-1) d=2;
    if (c==-1) c=5;
    if (d * 52 < (c + 1) * n + 1) exit(-1);
    welcom(fp,r,d,n);
    //make the player
    p *head = initialize();
    for (int i = 2; i <= n; i++) {
        insert(&head);
    }
    //we need to remain the head

    p* temp;
    for (int rounds=1;rounds<=r;rounds++) {
        int cntstock = d * 52;
        int cntdis = 0;
        int *stock = malloc((size_t)INT*(size_t)cntstock);
        if (stock==NULL) exit(-1);
        int *discard = malloc((size_t)INT*(size_t)cntstock);
        if (discard==NULL) exit(-1);

        for (int i=0;i<52*d;i++) *(stock+i)=i%52;
        shuffle(stock, cntstock);
        fprintf(fp,"Shuffling cards...\n");
        givecard(head, stock, &cntstock, discard, &cntdis,-1);
        printshuffle(head,fp);
        //deletecard(head, 0, discard, &cntdis);

        for (int i=head->cntelem;i>0;i--) {
            deletecard(head, i-1, discard, &cntdis);
        }

        p *ttemp = head;
        while (ttemp->right != head) {
            givecard(ttemp, stock, &cntstock, discard, &cntdis, c);

            ttemp = ttemp->right;
        }
        givecard(ttemp, stock, &cntstock, discard, &cntdis, c);

        if (rounds==1) {
            temp = head;
            determine(&temp, discard, stock, &cntstock, &cntdis, n, fp);
        }
        //temp is the head of this turn

        int flag = 0;
        int clock = 1;// the counterclock order
        int ch = 0;
        int accumulate = 0;
        int jump = 1;

        p *ini = initialize();//should be free
        givecard(ini, stock, &cntstock, discard, &cntdis, 1);
        int init =*(ini->elem);//the first card
        deletecard(ini, 0, discard, &cntdis);
        freedom(ini);
        //determine the first card

        int whoisplay=0;
        p* tt=head;
        while (tt->right!=temp){
            tt=tt->right;
            whoisplay++;
        }
        whoisplay++;
        whoisplay%=n; //who is play now

        int can = 0;  //can or cannot implement the command
        int fll=1;
        while (ch != n) { //the game begin
            //system("cls");
            if (temp->cntelem == 0) flag = 1; //stop the game
            //something need to be recorded
            if (flag == 0) {

                printf("----Player %d's Round----\n",whoisplay + 1);
                fprintf(fp,"----Player %d's Round----\n",whoisplay + 1);
                int stunt=whoisplay;
                p* ass=temp;
                switch (clock){
                    case 1: while (ass->right!=temp) {
                            printf("Player %d has %d card(s)\n", stunt + 1, ass->cntelem);
                            ass = ass->right;
                            stunt = (stunt + 1) % n;
                        }
                        printf("Player %d has %d card(s)\n",stunt+1,ass->cntelem);
                        break;
                    default:while (ass->left!=temp) {
                            printf("Player %d has %d card(s)\n", stunt + 1, ass->cntelem);
                            ass = ass->left;
                            stunt = (stunt + n - 1) % n;
                        }
                        printf("Player %d has %d card(s)\n",stunt+1,ass->cntelem);
                        break;
                }
                if (fll==0) {
                    printf("Last card:\n");
                    fprintf(fp,"Last card:\n");
                }
                else{
                    printf("First card:\n");
                    fprintf(fp,"First card:\n");
                    fll=0;
                }
                printcc(init,fp);
                printf("clock is %d,Current attack is %d\n", clock, accumulate);

                printplayer(temp, whoisplay + 1);
                can = 0;
                for (int i = 0; i < temp->cntelem; i++)
                    if (check(temp, i, &init, accumulate) == 1) {
                        can = 1;
                        fprintf(fp,"Player %d plays:\n",whoisplay+1);
                        printcc(*(temp->elem+i),fp);
                        implement(temp, i, &init, &accumulate, &clock, &jump);
                        deletecard(temp, i, discard, &cntdis);
                        break;
                    }

                if (can==0) {
                    if (accumulate == 0) {
                        givecard(temp, stock, &cntstock, discard, &cntdis, 1);
                        fprintf(fp,"Player %d draws a card: \n",whoisplay+1);
                    } else {
                        givecard(temp, stock, &cntstock, discard, &cntdis, accumulate);
                        fprintf(fp,"Player %d draws %d cards: \n",whoisplay+1,accumulate);
                        accumulate = 0;
                    }
                }

                if (temp->cntelem == 0) {
                    flag = 1;
                    fprintf(fp,"Player %d wins round %d! \n",whoisplay+1,rounds);
                }
                else{
                    fprintf(fp,"Player %d cards: \n",whoisplay+1);
                    printshuffle(temp,fp);
                }
            }

            if (flag == 1) {
                temp->score -= temp->cntelem;
                //free
                ch++;
            }
            //why head didn't change
            turnaroundmore(&jump, &whoisplay, n, &temp, clock);
        }
        //temp has gone back to who win the game
        free(stock);
        free(discard);

        clear(temp);

        printf("---States----\n");
        fprintf(fp,"---States----\n");
        p* x=head;
        int k=1;

        while (x->right != head) {
                printf("player %d: %d\n", k, x->score);
                fprintf(fp,"player %d: %d\n", k, x->score);
                k++;
                x = x->right;
            }
        printf("player %d: %d\n", k, x->score);
        fprintf(fp,"player %d: %d\n", k, x->score);
        printf("Rounds %d ends.",rounds);
        fprintf(fp,"Rounds %d ends.",rounds);

        if (rounds==r) {
            p* x=head;
            int large=-100000;
            while (x->right != head) {
                large= large > x->score ? large : x->score;
                x = x->right;
            }
            large=large > x->score ? large : x->score;
            //printf("%d\n",large);
            printf("\nPlayer ");
            fprintf(fp,"\nPlayer ");

            x=head;
            int k=0;
            while (x->right != head) {
                k++;
                if (x->score==large)
                {
                    printf("%d ",k);
                    fprintf(fp,"%d ",k);
                }
                x = x->right;
            }
            k++;
            if (x->score==large)
            {
                printf("%d ",k);
                fprintf(fp,"%d ",k);
            }
            printf("win(s) the game.\n");
            fprintf(fp,"win(s) the game.\n");
        }

    }
    freedom(head);
    fclose(fp);
}


