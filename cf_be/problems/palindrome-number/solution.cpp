#include <iostream>
#include <string>
#include <algorithm>
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
        long long x;
        if (!(in >> x)) break;

        bool result;
        if (x < 0) {
            result = false;
        } else {
            string s = to_string(x);
            string rs = s;
            reverse(rs.begin(), rs.end());
            result = (s == rs);
        }

        out << (result ? "true" : "false") << endl;
    }

    in.close();
    out.close();
    cout << "Successfully processed " << numCases << " test cases. Results in output.txt" << endl;
    return 0;
}
