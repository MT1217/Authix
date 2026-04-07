#include <iostream>
#include <pthread.h>
#include <unistd.h>
using namespace std;
void* routine(void* arg)
{
    cout<<"Test from threads"<<endl;
    return NULL;
}
int main(int argc,char* argv[])
{
    pthread_t t1;
    if(pthread_create(&t1,NULL,routine,NULL) != 0)
    {
        return 1;
    };
    if(pthread_join(t1,NULL) != 0) return 2;
    return 0;
}