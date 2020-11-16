//
// Created by kirp on 2020/11/12.
//
#include"project2.h"

void givecard(p* temp,int *stock,int *stockcnt,int *discard,int *cntdis,int c){//should change
    int fl=1;
    if (c==-1){
        c=*stockcnt;
        fl=0;
    }
    if (temp->elem==NULL){
        //printf("the space %d\n",c);
        temp->elem=malloc((size_t)c*(size_t)INT);
        if (temp->elem==NULL) exit(-1);
    }
    else{
        temp->elem=realloc(temp->elem,(size_t)INT*(size_t)(temp->cntelem+c));
        if (temp->elem==NULL) exit(-1);
    }

    for (int i=0;i<c;i++){
        if ((*stockcnt)+(*cntdis)==0){
            printf("Not Enough Card! Input 0 to exit.\n");
            free(stock);
            free(discard);
            freedom(temp);
            char c[100];
            scanf("%s",c);
            exit(-1);
        }
        if (*stockcnt==0 && *cntdis>0){
            //printf("swap cntdis %d stockcnt %d\n",*cntdis,*stockcnt);
            swap(&stock,stockcnt,&discard,cntdis);
            shuffle(stock,*stockcnt);
            //printf("swap cntdis %d stockcnt %d\n",*cntdis,*stockcnt);
        }
        /*for (int i=0;i<*stockcnt;i++){
            printf("%d ",*(stock+i));
        }
        printf("\n");
         */
        *(temp->elem+temp->cntelem+i)=*(stock+*stockcnt-1);

        (*stockcnt)--;
        //printf("stockcnt%d\n",*stockcnt);

    }
    (temp->cntelem)+=c;

    if (fl==1) {
        qsort(temp->elem,(size_t)temp->cntelem,(size_t)INT,cmpINT);
    }
}

