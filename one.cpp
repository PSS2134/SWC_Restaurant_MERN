#include<bits/stdc++.h>
using namespace std;
int check(int mid, vector<int>&arr, int a, int b){
     
     int n = arr.size();
     int cntMin = 0, cntAdder = 0,  store = -1;
     for(int i = 0; i < n; i++){
        if(arr[i] < mid){
           if((mid - arr[i]) % a == 0) cntAdder += (mid - arr[i]) / a;
           else {
 
            cntAdder += ((mid - arr[i]) / a) + 1; //
           
            cntMin++;
           }
        }
        else {
           
            if(store == -1) store = i;
            cntAdder -= ((arr[i] - mid) / b);
            //cout<<cntAdder<<" "<<arr[i]<<endl;
           
        }
     }
        //cout << mid<<" "<< cntAdder << endl;
        if(cntAdder <= 0){
           if(cntMin < store) return 1;
           return -1;
        } 
        return 0;
     
}
int main()
{

    int n, a, b;
    cin >> n >> a >> b;
    vector<int>arr(n);
    
    for(int i = 0; i < n; i++)cin >> arr[i];

    sort(arr.begin(), arr.end());
    int low = arr[0];
    int high = arr[n - 1];
    int ans = low;
    while(low <= high) {

        int mid = (low + high) / 2;
        int var = check(mid, arr, a, b);
        if(var == 1 || var == -1)
        {
            if(var == 1) ans = mid;
            low = mid + 1;
        }
        else high = mid - 1;
    }

    cout << ans << endl;


    return 0;
}