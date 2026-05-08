#include <iostream>
#include <vector>
#include <random>
#include <fstream>
#include <algorithm>

using namespace std;

int getRandomInt(int min, int max, mt19937& gen) {
    uniform_int_distribution<> dis(min, max);
    return dis(gen);
}

int main() {
    ofstream out("input.txt");
    random_device rd;
    mt19937 gen(rd());

    int numCases = 10;
    out << numCases << endl;

    for (int i = 0; i < numCases; i++) {
        int n = getRandomInt(2, 1000, gen);
        vector<int> nums;
        for (int j = 0; j < n; j++) {
            nums.push_back(getRandomInt(-1e6, 1e6, gen));
        }

        int idx1 = getRandomInt(0, n - 1, gen);
        int idx2 = getRandomInt(0, n - 1, gen);
        while (idx1 == idx2) idx2 = getRandomInt(0, n - 1, gen);

        long long target = (long long)nums[idx1] + nums[idx2];

        out << n << " " << target << endl;
        for (int j = 0; j < n; j++) {
            out << nums[j] << (j == n - 1 ? "" : " ");
        }
        out << endl;
    }

    out.close();
    cout << "Generated " << numCases << " test cases in input.txt" << endl;
    return 0;
}
