#include <iostream>
#include <vector>
#include <random>
#include <fstream>
#include <string>
#include <algorithm>

using namespace std;

long long getRandomLong(long long min, long long max, mt19937_64& gen) {
    uniform_int_distribution<long long> dis(min, max);
    return dis(gen);
}

int main() {
    ofstream out("input.txt");
    random_device rd;
    mt19937_64 gen(rd());

    int numCases = 10;
    out << numCases << endl;

    uniform_real_distribution<> dis_choice(0, 1);

    for (int i = 0; i < numCases; i++) {
        double choice = dis_choice(gen);
        long long x;

        if (choice < 0.4) {
            // Generate a palindrome
            string s = to_string(getRandomLong(0, 1000000, gen));
            string rs = s;
            reverse(rs.begin(), rs.end());
            x = stoll(s + rs);
        } else if (choice < 0.7) {
            // Random positive integer (roughly INT_MAX)
            x = getRandomLong(0, 2147483647, gen);
        } else {
            // Random negative integer (roughly INT_MIN)
            x = getRandomLong(-2147483648LL, -1, gen);
        }

        out << x << endl;
    }

    out.close();
    cout << "Generated " << numCases << " test cases in input.txt" << endl;
    return 0;
}
