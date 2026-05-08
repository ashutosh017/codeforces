#include <iostream>
#include <vector>
#include <unordered_map>
#include <fstream>

using namespace std;

int main() {
    ifstream in("input.txt");
    ofstream out("output.txt");

    if (!in.is_open()) {
        cerr << "input.txt not found. Run generator first." << endl;
        return 1;
    }

    int numCases;
    in >> numCases;

    for (int t = 0; t < numCases; t++) {
        int n;
        long long target;
        in >> n >> target;

        vector<int> nums(n);
        for (int i = 0; i < n; i++) {
            in >> nums[i];
        }

        unordered_map<long long, int> m;
        vector<int> result(2, -1);
        for (int i = 0; i < n; i++) {
            long long complement = target - nums[i];
            if (m.count(complement)) {
                result = {m[complement], i};
                break;
            }
            m[nums[i]] = i;
        }

        out << "[" << result[0] << "," << result[1] << "]" << endl;
    }

    in.close();
    out.close();
    cout << "Successfully processed " << numCases << " test cases. Results in output.txt" << endl;
    return 0;
}
