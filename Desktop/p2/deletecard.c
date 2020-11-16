//
// Created by kirp on 2020/11/13.
//
#include "project2.h"

void deletecard(p* head,int command,int *discard,int *cntdis){
    *(discard+*cntdis)=*(head->elem+command);
    (*cntdis)++;
    *(head->elem+command)=0;
    *(head->elem+command)=*(head->elem+head->cntelem-1);
    *(head->elem+head->cntelem-1)=0;
    (head->cntelem)--;

    qsort(head->elem,(size_t)head->cntelem,(size_t)INT,cmpINT);

}
