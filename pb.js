// 1.你正在使用一堆木板建造跳水板。有两种类型的木板，其中长度较短的木板长度为 shorter，长度较长的木板长度为 longer。你必须正好使用 k 块木板。编写一个方法，生成跳水板所有可能的长度。
// 返回的长度需要从小到大排列。
// 输入：
// shorter = 1
// longer = 2
// k = 3
// 输出： {3,4,5,6}
/**
 * @author wa0u
 * @DateTime 2020-07-09T09:40:50+0800
 * @param    {number}
 * @param    {number}
 * @param    {number}
 * @return   {array}
 */
let divingBord = function(shorter, longer, k) {
    if (k === 0) {
        return [];
    }
    if (shorter === longer) {
        return [k * longer];
    }

    let result = [];
    for (var i = 0; i < k; i++) {
        let longerCount = i;
        let shorterCount = k - i;
        result.push(longerCount * longer + shorterCount * shorter);
    }

    return result;
}

// 2.如果序列  X_1, X_2, ..., X_n  满足下列条件，就说它是 斐波那契式：
// n >= 3
// 对于所有  i + 2 <= n，都有  X_i + X_{i+1} = X_{i+2}
// 给定一个严格递增的正整数数组形成序列，找到 A 中最长的斐波那契式的子序列的长度。如果一个不存在，返回   0 。
// （回想一下，子序列是从原序列 A  中派生出来的，它从 A  中删掉任意数量的元素（也可以不删），而不改变其余元素的顺序。例如， [3, 5, 8]  是  [3, 4, 5, 6, 7, 8]  的一个子序列）
// 示例 1：
// 输入: [1,2,3,4,5,6,7,8]
// 输出: 5
// 解释:
// 最长的斐波那契式子序列为：[1,2,3,5,8] 。
// 示例 2：
// 输入: [1,3,7,11,12,14,18]
// 输出: 3
// 解释:
// 最长的斐波那契式子序列有：
// [1,11,12]，[3,11,14] 以及 [7,11,18] 。
// dp[i] 表示从 0 ~ i 可以得到的斐波那契子序列（或者长度小于 3，作为一个预备可选项）的所有组合。数组里的每一项需要分别维护：
// sum: 当前斐波那契子序列的最后两项的和。
// head：当前斐波那契子序列的最后两项的第一个数字。
// len: 当前斐波那契子序列长度。
// 之所以只需要关心 最后两项，是因为能否和下一个数字组成斐波那契子序列，只需要考虑上一个子序列的尾部两个数字即可，比如 [1, 2, 3] 是一个斐波那契子序列，但是它之后去和 5 组合，只需要考虑 [2, 3] 与 5 的可组合性。当我们记录下来 sum 为 5了以后，只需要去找到 5 这个数字，就确定可以组合成一个斐波那契子序列了。
// 而记录 head 是因为，找到了 [2, 3, 5] 以后，是需要把 2 这一项给删除掉，以 3 + 5 作为下一个目标 sum的，所以必须要有地方记录下来 2 这个数字。
// 而下一项的 head 应该是 3，这个如何得出呢？其实只需要用上一次记录的 sum: 5 减去上一次的 head: 2，即可得出上一次的末尾 3，作为下一次的 head。
// 也就是说 sum 其实是两个元素所组成的数组在不断的向后“滑动”，上一次的尾部就是下一次的头部。
// 最后，在求出的所有结果里找出 len 最大的那一项就可以了
/**
 * @author wa0u
 * @DateTime 2020-07-09T10:35:37+0800
 * @param    {array} A
 * @return   {array}
 */
let lenLongestFibSubseq = function(A) {
    let n = A.length;
    if (!n) return 0;

    let dp = [];
    dp[0] = [{ sum: A[0], len: 1, head: A[0] }];

    for (let i = 0; i < n; i++) {
        let cur = A[i];
        let selections = [{ sum: cur, len: 1, head: cur }];
        for (let j = 0; j < i; j++) {
            for (let selection in object) {
                const { sum, len, head } = selection;
                // 长度为1 和任何值都可以组成一个选项
                if (len === 1) {
                    selections.push({ sum: cur + sum, len: 2, head: sum });
                } else if (sum === cur) {
                    // 长度大于1的时候 只有之前的和与当前数字相等 才可以组成一个斐波那契序列
                    // 在组成新的组合的时候 要去掉之前的头部 比如[1, 2]和3组合 变成 [2, 3]
                    // 并且下一步需要求的目标和也需要是2+3=5 所以sum需要在之前的基础上减去头部1，再加上尾部3
                    // 下一步的head 其实就是这一步的末尾数字 直接用sum-head就可以得出 比如3-1=2
                    selections.push({
                        sum: sum - head + cur,
                        len: len + 1,
                        head: cur - head,
                    })
                }
            }
            dp[i] = selections;
        }
    }

    let result = Math.max(...dp.flat().map(({ len }) => len))
    return result >= 3 ? result : 0;
}

// 3.我们定义「顺次数」为：每一位上的数字都比前一位上的数字大 1 的整数。
// 请你返回由  [low, high]  范围内所有顺次数组成的 有序 列表（从小到大排序）。
// 示例 1：
// 输出：low = 100, high = 300
// 输出：[123,234]
// 示例 2：
// 输出：low = 1000, high = 13000
// 输出：[1234,2345,3456,4567,5678,6789,12345]
// 提示：
// 10 <= low <= high <= 10^9
// 先通过 low和high之间的长度对比，得到总共有几种数字长度。
// 然后循环这些数字长度 len 作为目标， 1 作为最小起点， 10 - len 作为最大的起点，不断尝试构造出长度为 len 的顺位数字即可。

let sequentialDigits = function(low, high) {
    let lowLen = low.toString().length;
    let highLen = high.toString().length;
    let lens = [];
    for (let i = lowLen; i <= highLen; i++) {
        lens.push(i);
    }

    let res = [];
    for (let i = 0; i < lens.length; i++) {
        let len = lens[i];
        for (let start = 1; start <= 10 - len; start++) {
            let num = start;
            for (let n = start + 1; n < start + len; n++) {
                num = 10 * num + n;
            }
            if (num <= high && num >= low) {
                res.push(num);
            }
        }
    }
    return res;
}