#include<stdlib.h>
#include<stdio.h>
#include<unistd.h>
#include<pthread.h>
using namespace std;
void* routine()
{
    cout<<"Test from threads"<<endl;
}
int main()
{
    pthread_t p1;
    pthread_create(&p1,NULL,routine,NULL);
    pthread_join(p1,NULL);
    return 0;
}