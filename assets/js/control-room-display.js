$(document).ready(function () {
    let chartInstance;

    window.onerror = function (message, source, lineno, colno, error) {
        console.error("Global Error:", message, "at", source, ":", lineno, ":", colno);
    };

    // Function to fetch data and update the graph
    function fetchAndRenderGraph() {
        const fake_data = [
            {
                "HR": "2024-11-13 00:00:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 990,
                "WSCRA_MW": 953.7,
                "LRT_MW": 11349.185,
                "LSCRA_MW": 10890,
                "IRT_MW": -1336,
                "ISCRA_MW": 54
            },
            {
                "HR": "2024-11-13 00:05:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 1006,
                "WSCRA_MW": 951.2397,
                "LRT_MW": 11249.309,
                "LSCRA_MW": 10872.3693,
                "IRT_MW": -1336,
                "ISCRA_MW": 54
            },
            {
                "HR": "2024-11-13 00:10:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 1005.8,
                "WSCRA_MW": 948.7794,
                "LRT_MW": 11174.717,
                "LSCRA_MW": 10854.7387,
                "IRT_MW": -1336,
                "ISCRA_MW": 54
            },
            {
                "HR": "2024-11-13 00:15:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 1019.1,
                "WSCRA_MW": 946.3192,
                "LRT_MW": 11183.596,
                "LSCRA_MW": 10837.108,
                "IRT_MW": -1414,
                "ISCRA_MW": 54
            },
            {
                "HR": "2024-11-13 00:20:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 1010.5,
                "WSCRA_MW": 943.8589,
                "LRT_MW": 11155.662,
                "LSCRA_MW": 10819.4774,
                "IRT_MW": -1414,
                "ISCRA_MW": 54
            },
            {
                "HR": "2024-11-13 00:25:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 1040.5,
                "WSCRA_MW": 941.3986,
                "LRT_MW": 11119.38,
                "LSCRA_MW": 10801.8467,
                "IRT_MW": -1414,
                "ISCRA_MW": 54
            },
            {
                "HR": "2024-11-13 00:30:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 1018.8,
                "WSCRA_MW": 938.9383,
                "LRT_MW": 11071.789,
                "LSCRA_MW": 10784.216,
                "IRT_MW": -1517,
                "ISCRA_MW": 54
            },
            {
                "HR": "2024-11-13 00:35:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 1007.4,
                "WSCRA_MW": 936.478,
                "LRT_MW": 11042.051,
                "LSCRA_MW": 10766.5854,
                "IRT_MW": -1517,
                "ISCRA_MW": 54
            },
            {
                "HR": "2024-11-13 00:40:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 991.3,
                "WSCRA_MW": 934.0178,
                "LRT_MW": 11024.862,
                "LSCRA_MW": 10748.9547,
                "IRT_MW": -1517,
                "ISCRA_MW": 54
            },
            {
                "HR": "2024-11-13 00:45:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 995.9,
                "WSCRA_MW": 931.5575,
                "LRT_MW": 11002.986,
                "LSCRA_MW": 10731.324,
                "IRT_MW": -1417,
                "ISCRA_MW": 54
            },
            {
                "HR": "2024-11-13 00:50:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 983.2,
                "WSCRA_MW": 929.0972,
                "LRT_MW": 10948.025,
                "LSCRA_MW": 10713.6934,
                "IRT_MW": -1417,
                "ISCRA_MW": 54
            },
            {
                "HR": "2024-11-13 00:55:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 959.9,
                "WSCRA_MW": 926.6369,
                "LRT_MW": 10920.882,
                "LSCRA_MW": 10696.0627,
                "IRT_MW": -1417,
                "ISCRA_MW": 54
            },
            {
                "HR": "2024-11-13 01:00:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 955.8,
                "WSCRA_MW": 924.1767,
                "LRT_MW": 10932.217,
                "LSCRA_MW": 10678.4321,
                "IRT_MW": -53,
                "ISCRA_MW": 64
            },
            {
                "HR": "2024-11-13 01:05:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 947.6,
                "WSCRA_MW": 921.3359,
                "LRT_MW": 10929.165,
                "LSCRA_MW": 10670,
                "IRT_MW": -53,
                "ISCRA_MW": 64
            },
            {
                "HR": "2024-11-13 01:10:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 938.1,
                "WSCRA_MW": 918.1463,
                "LRT_MW": 10872.683,
                "LSCRA_MW": 10670,
                "IRT_MW": -53,
                "ISCRA_MW": 64
            },
            {
                "HR": "2024-11-13 01:15:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 938.9,
                "WSCRA_MW": 914.9568,
                "LRT_MW": 10852.772,
                "LSCRA_MW": 10670,
                "IRT_MW": -44,
                "ISCRA_MW": 64
            },
            {
                "HR": "2024-11-13 01:20:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 947.6,
                "WSCRA_MW": 911.7672,
                "LRT_MW": 10859.349,
                "LSCRA_MW": 10670,
                "IRT_MW": -44,
                "ISCRA_MW": 64
            },
            {
                "HR": "2024-11-13 01:25:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 949,
                "WSCRA_MW": 908.5777,
                "LRT_MW": 10811.984,
                "LSCRA_MW": 10670,
                "IRT_MW": -44,
                "ISCRA_MW": 64
            },
            {
                "HR": "2024-11-13 01:30:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 958.1,
                "WSCRA_MW": 905.3882,
                "LRT_MW": 10806.87,
                "LSCRA_MW": 10670,
                "IRT_MW": -335,
                "ISCRA_MW": 64
            },
            {
                "HR": "2024-11-13 01:35:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 946.7,
                "WSCRA_MW": 902.1986,
                "LRT_MW": 10788.209,
                "LSCRA_MW": 10670,
                "IRT_MW": -335,
                "ISCRA_MW": 64
            },
            {
                "HR": "2024-11-13 01:40:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 963.7,
                "WSCRA_MW": 899.0091,
                "LRT_MW": 10771.914,
                "LSCRA_MW": 10670,
                "IRT_MW": -335,
                "ISCRA_MW": 64
            },
            {
                "HR": "2024-11-13 01:45:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 952.3,
                "WSCRA_MW": 895.8195,
                "LRT_MW": 10767.907,
                "LSCRA_MW": 10670,
                "IRT_MW": -335,
                "ISCRA_MW": 64
            },
            {
                "HR": "2024-11-13 01:50:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 950.9,
                "WSCRA_MW": 892.63,
                "LRT_MW": 10745.875,
                "LSCRA_MW": 10670,
                "IRT_MW": -335,
                "ISCRA_MW": 64
            },
            {
                "HR": "2024-11-13 01:55:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 937.2,
                "WSCRA_MW": 889.4404,
                "LRT_MW": 10712.981,
                "LSCRA_MW": 10670,
                "IRT_MW": -335,
                "ISCRA_MW": 64
            },
            {
                "HR": "2024-11-13 02:00:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 917.3,
                "WSCRA_MW": 886.2509,
                "LRT_MW": 10721.981,
                "LSCRA_MW": 10670,
                "IRT_MW": -536,
                "ISCRA_MW": -126
            },
            {
                "HR": "2024-11-13 02:05:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 914.6,
                "WSCRA_MW": 883.0822,
                "LRT_MW": 10712.079,
                "LSCRA_MW": 10670.4878,
                "IRT_MW": -536,
                "ISCRA_MW": -126
            },
            {
                "HR": "2024-11-13 02:10:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 923.6,
                "WSCRA_MW": 880.3735,
                "LRT_MW": 10698.932,
                "LSCRA_MW": 10681.7073,
                "IRT_MW": -536,
                "ISCRA_MW": -126
            },
            {
                "HR": "2024-11-13 02:15:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 899.3,
                "WSCRA_MW": 877.6648,
                "LRT_MW": 10721.008,
                "LSCRA_MW": 10692.9268,
                "IRT_MW": -404,
                "ISCRA_MW": -126
            },
            {
                "HR": "2024-11-13 02:20:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 889.4,
                "WSCRA_MW": 874.9561,
                "LRT_MW": 10692.563,
                "LSCRA_MW": 10704.1463,
                "IRT_MW": -404,
                "ISCRA_MW": -126
            },
            {
                "HR": "2024-11-13 02:25:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 885.9,
                "WSCRA_MW": 872.2474,
                "LRT_MW": 10731.633,
                "LSCRA_MW": 10715.3659,
                "IRT_MW": -404,
                "ISCRA_MW": -126
            },
            {
                "HR": "2024-11-13 02:30:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 887.7,
                "WSCRA_MW": 869.5387,
                "LRT_MW": 10686.589,
                "LSCRA_MW": 10726.5854,
                "IRT_MW": -436,
                "ISCRA_MW": -126
            },
            {
                "HR": "2024-11-13 02:35:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 886.2,
                "WSCRA_MW": 866.83,
                "LRT_MW": 10658.689,
                "LSCRA_MW": 10737.8049,
                "IRT_MW": -436,
                "ISCRA_MW": -126
            },
            {
                "HR": "2024-11-13 02:40:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 891.8,
                "WSCRA_MW": 864.1213,
                "LRT_MW": 10683.513,
                "LSCRA_MW": 10749.0244,
                "IRT_MW": -436,
                "ISCRA_MW": -126
            },
            {
                "HR": "2024-11-13 02:45:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 886.8,
                "WSCRA_MW": 861.4125,
                "LRT_MW": 10677.14,
                "LSCRA_MW": 10760.2439,
                "IRT_MW": -454,
                "ISCRA_MW": -126
            },
            {
                "HR": "2024-11-13 02:50:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 865.6,
                "WSCRA_MW": 858.7038,
                "LRT_MW": 10665.65,
                "LSCRA_MW": 10771.4634,
                "IRT_MW": -454,
                "ISCRA_MW": -126
            },
            {
                "HR": "2024-11-13 02:55:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 867,
                "WSCRA_MW": 855.9951,
                "LRT_MW": 10705.698,
                "LSCRA_MW": 10782.6829,
                "IRT_MW": -454,
                "ISCRA_MW": -126
            },
            {
                "HR": "2024-11-13 03:00:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 888.8,
                "WSCRA_MW": 853.2864,
                "LRT_MW": 10690.462,
                "LSCRA_MW": 10793.9024,
                "IRT_MW": -306,
                "ISCRA_MW": -24
            },
            {
                "HR": "2024-11-13 03:05:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 892.6,
                "WSCRA_MW": 850.5777,
                "LRT_MW": 10747.358,
                "LSCRA_MW": 10805.122,
                "IRT_MW": -306,
                "ISCRA_MW": -24
            },
            {
                "HR": "2024-11-13 03:10:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 888.4,
                "WSCRA_MW": 846.9359,
                "LRT_MW": 10723.898,
                "LSCRA_MW": 10827.2125,
                "IRT_MW": -306,
                "ISCRA_MW": -24
            },
            {
                "HR": "2024-11-13 03:15:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 903.2,
                "WSCRA_MW": 842.5763,
                "LRT_MW": 10719.946,
                "LSCRA_MW": 10857.6655,
                "IRT_MW": -402,
                "ISCRA_MW": -24
            },
            {
                "HR": "2024-11-13 03:20:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 891.7,
                "WSCRA_MW": 838.2167,
                "LRT_MW": 10743.087,
                "LSCRA_MW": 10888.1185,
                "IRT_MW": -402,
                "ISCRA_MW": -24
            },
            {
                "HR": "2024-11-13 03:25:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 886.5,
                "WSCRA_MW": 833.8571,
                "LRT_MW": 10746.417,
                "LSCRA_MW": 10918.5714,
                "IRT_MW": -402,
                "ISCRA_MW": -24
            },
            {
                "HR": "2024-11-13 03:30:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 876.3,
                "WSCRA_MW": 829.4976,
                "LRT_MW": 10761.395,
                "LSCRA_MW": 10949.0244,
                "IRT_MW": -366,
                "ISCRA_MW": -24
            },
            {
                "HR": "2024-11-13 03:35:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 877.8,
                "WSCRA_MW": 825.138,
                "LRT_MW": 10762.853,
                "LSCRA_MW": 10979.4774,
                "IRT_MW": -366,
                "ISCRA_MW": -24
            },
            {
                "HR": "2024-11-13 03:40:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 887.6,
                "WSCRA_MW": 820.7784,
                "LRT_MW": 10788.795,
                "LSCRA_MW": 11009.9303,
                "IRT_MW": -366,
                "ISCRA_MW": -24
            },
            {
                "HR": "2024-11-13 03:45:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 890.1,
                "WSCRA_MW": 816.4188,
                "LRT_MW": 10798.521,
                "LSCRA_MW": 11040.3833,
                "IRT_MW": -306,
                "ISCRA_MW": -24
            },
            {
                "HR": "2024-11-13 03:50:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 880.1,
                "WSCRA_MW": 812.0592,
                "LRT_MW": 10814.392,
                "LSCRA_MW": 11070.8362,
                "IRT_MW": -306,
                "ISCRA_MW": -24
            },
            {
                "HR": "2024-11-13 03:55:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 894,
                "WSCRA_MW": 807.6997,
                "LRT_MW": 10900.036,
                "LSCRA_MW": 11101.2892,
                "IRT_MW": -306,
                "ISCRA_MW": -24
            },
            {
                "HR": "2024-11-13 04:00:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 856.7,
                "WSCRA_MW": 803.3401,
                "LRT_MW": 10892.626,
                "LSCRA_MW": 11131.7422,
                "IRT_MW": -562,
                "ISCRA_MW": 560
            },
            {
                "HR": "2024-11-13 04:05:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 851,
                "WSCRA_MW": 798.9805,
                "LRT_MW": 10940.749,
                "LSCRA_MW": 11162.1951,
                "IRT_MW": -562,
                "ISCRA_MW": 560
            },
            {
                "HR": "2024-11-13 04:10:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 863.1,
                "WSCRA_MW": 794.816,
                "LRT_MW": 10998.106,
                "LSCRA_MW": 11196.8293,
                "IRT_MW": -562,
                "ISCRA_MW": 560
            },
            {
                "HR": "2024-11-13 04:15:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 853.9,
                "WSCRA_MW": 792.7003,
                "LRT_MW": 11046.484,
                "LSCRA_MW": 11275.3659,
                "IRT_MW": -562,
                "ISCRA_MW": 560
            },
            {
                "HR": "2024-11-13 04:20:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 848.8,
                "WSCRA_MW": 790.5847,
                "LRT_MW": 11068.768,
                "LSCRA_MW": 11353.9024,
                "IRT_MW": -562,
                "ISCRA_MW": 560
            },
            {
                "HR": "2024-11-13 04:25:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 849.3,
                "WSCRA_MW": 788.469,
                "LRT_MW": 11117.899,
                "LSCRA_MW": 11432.439,
                "IRT_MW": -562,
                "ISCRA_MW": 560
            },
            {
                "HR": "2024-11-13 04:30:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 833.4,
                "WSCRA_MW": 786.3533,
                "LRT_MW": 11144.068,
                "LSCRA_MW": 11510.9756,
                "IRT_MW": -562,
                "ISCRA_MW": 560
            },
            {
                "HR": "2024-11-13 04:35:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 855.4,
                "WSCRA_MW": 784.2376,
                "LRT_MW": 11238.172,
                "LSCRA_MW": 11589.5122,
                "IRT_MW": -562,
                "ISCRA_MW": 560
            },
            {
                "HR": "2024-11-13 04:40:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 861,
                "WSCRA_MW": 782.122,
                "LRT_MW": 11228.854,
                "LSCRA_MW": 11668.0488,
                "IRT_MW": -562,
                "ISCRA_MW": 560
            },
            {
                "HR": "2024-11-13 04:45:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 880.6,
                "WSCRA_MW": 780.0063,
                "LRT_MW": 11271.877,
                "LSCRA_MW": 11746.5854,
                "IRT_MW": -562,
                "ISCRA_MW": 560
            },
            {
                "HR": "2024-11-13 04:50:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 874.6,
                "WSCRA_MW": 777.8906,
                "LRT_MW": 11325.842,
                "LSCRA_MW": 11825.122,
                "IRT_MW": -562,
                "ISCRA_MW": 560
            },
            {
                "HR": "2024-11-13 04:55:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 853.3,
                "WSCRA_MW": 775.7749,
                "LRT_MW": 11418.379,
                "LSCRA_MW": 11903.6585,
                "IRT_MW": -562,
                "ISCRA_MW": 560
            },
            {
                "HR": "2024-11-13 05:00:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 865.6,
                "WSCRA_MW": 773.6592,
                "LRT_MW": 11511.364,
                "LSCRA_MW": 11982.1951,
                "IRT_MW": -758,
                "ISCRA_MW": 388
            },
            {
                "HR": "2024-11-13 05:05:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 871.9,
                "WSCRA_MW": 771.5436,
                "LRT_MW": 11675.117,
                "LSCRA_MW": 12060.7317,
                "IRT_MW": -758,
                "ISCRA_MW": 388
            },
            {
                "HR": "2024-11-13 05:10:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2,
                "WRT_MW": 853.9,
                "WSCRA_MW": 769.4279,
                "LRT_MW": 11738.963,
                "LSCRA_MW": 12139.2683,
                "IRT_MW": -758,
                "ISCRA_MW": 388
            },
            {
                "HR": "2024-11-13 05:15:00",
                "SRT_MW": 0,
                "SSCRA_MW": 2.4195,
                "WRT_MW": 851.7,
                "WSCRA_MW": 767.7805,
                "LRT_MW": 11787.475,
                "LSCRA_MW": 12239.2683,
                "IRT_MW": -906,
                "ISCRA_MW": 388
            },
            {
                "HR": "2024-11-13 05:20:00",
                "SRT_MW": 0,
                "SSCRA_MW": 3.1087,
                "WRT_MW": 849.6,
                "WSCRA_MW": 766.4341,
                "LRT_MW": 11899.085,
                "LSCRA_MW": 12353.0662,
                "IRT_MW": -906,
                "ISCRA_MW": 388
            },
            {
                "HR": "2024-11-13 05:25:00",
                "SRT_MW": 0,
                "SSCRA_MW": 3.7979,
                "WRT_MW": 815.4,
                "WSCRA_MW": 765.0878,
                "LRT_MW": 11963.893,
                "LSCRA_MW": 12466.8641,
                "IRT_MW": -906,
                "ISCRA_MW": 388
            },
            {
                "HR": "2024-11-13 05:30:00",
                "SRT_MW": 0,
                "SSCRA_MW": 4.4871,
                "WRT_MW": 793.1,
                "WSCRA_MW": 763.7415,
                "LRT_MW": 12070.159,
                "LSCRA_MW": 12580.662,
                "IRT_MW": -1001,
                "ISCRA_MW": 388
            },
            {
                "HR": "2024-11-13 05:35:00",
                "SRT_MW": 0,
                "SSCRA_MW": 5.1763,
                "WRT_MW": 781.6,
                "WSCRA_MW": 762.3951,
                "LRT_MW": 12180.566,
                "LSCRA_MW": 12694.4599,
                "IRT_MW": -1001,
                "ISCRA_MW": 388
            },
            {
                "HR": "2024-11-13 05:40:00",
                "SRT_MW": 0,
                "SSCRA_MW": 5.8655,
                "WRT_MW": 786.2,
                "WSCRA_MW": 761.0488,
                "LRT_MW": 12286.261,
                "LSCRA_MW": 12808.2578,
                "IRT_MW": -1001,
                "ISCRA_MW": 388
            },
            {
                "HR": "2024-11-13 05:45:00",
                "SRT_MW": 0,
                "SSCRA_MW": 6.5547,
                "WRT_MW": 776.2,
                "WSCRA_MW": 759.7024,
                "LRT_MW": 12384.069,
                "LSCRA_MW": 12922.0557,
                "IRT_MW": -1056,
                "ISCRA_MW": 388
            },
            {
                "HR": "2024-11-13 05:50:00",
                "SRT_MW": 0,
                "SSCRA_MW": 7.2439,
                "WRT_MW": 777.5,
                "WSCRA_MW": 758.3561,
                "LRT_MW": 12538.321,
                "LSCRA_MW": 13035.8537,
                "IRT_MW": -1056,
                "ISCRA_MW": 388
            },
            {
                "HR": "2024-11-13 05:55:00",
                "SRT_MW": 0,
                "SSCRA_MW": 7.9331,
                "WRT_MW": 771.8,
                "WSCRA_MW": 757.0098,
                "LRT_MW": 12641.435,
                "LSCRA_MW": 13149.6516,
                "IRT_MW": -1056,
                "ISCRA_MW": 388
            },
            {
                "HR": "2024-11-13 06:00:00",
                "SRT_MW": 0,
                "SSCRA_MW": 8.6223,
                "WRT_MW": 778.5,
                "WSCRA_MW": 755.6634,
                "LRT_MW": 12907.479,
                "LSCRA_MW": 13263.4495,
                "IRT_MW": -1061,
                "ISCRA_MW": 507
            },
            {
                "HR": "2024-11-13 06:05:00",
                "SRT_MW": 0,
                "SSCRA_MW": 9.3115,
                "WRT_MW": 793.8,
                "WSCRA_MW": 754.3171,
                "LRT_MW": 13070.586,
                "LSCRA_MW": 13377.2474,
                "IRT_MW": -1061,
                "ISCRA_MW": 507
            },
            {
                "HR": "2024-11-13 06:10:00",
                "SRT_MW": 0,
                "SSCRA_MW": 10.0007,
                "WRT_MW": 782,
                "WSCRA_MW": 752.9707,
                "LRT_MW": 13224.396,
                "LSCRA_MW": 13491.0453,
                "IRT_MW": -1061,
                "ISCRA_MW": 507
            },
            {
                "HR": "2024-11-13 06:15:00",
                "SRT_MW": 0,
                "SSCRA_MW": 12.2495,
                "WRT_MW": 778.2,
                "WSCRA_MW": 751.6589,
                "LRT_MW": 13351.413,
                "LSCRA_MW": 13593.1359,
                "IRT_MW": -998,
                "ISCRA_MW": 507
            },
            {
                "HR": "2024-11-13 06:20:00",
                "SRT_MW": 0,
                "SSCRA_MW": 24.8955,
                "WRT_MW": 786.1,
                "WSCRA_MW": 750.577,
                "LRT_MW": 13474.378,
                "LSCRA_MW": 13617.1777,
                "IRT_MW": -998,
                "ISCRA_MW": 507
            },
            {
                "HR": "2024-11-13 06:25:00",
                "SRT_MW": 0,
                "SSCRA_MW": 37.5415,
                "WRT_MW": 774.9,
                "WSCRA_MW": 749.4951,
                "LRT_MW": 13579.924,
                "LSCRA_MW": 13641.2195,
                "IRT_MW": -998,
                "ISCRA_MW": 507
            },
            {
                "HR": "2024-11-13 06:30:00",
                "SRT_MW": 0.1,
                "SSCRA_MW": 50.1875,
                "WRT_MW": 759.3,
                "WSCRA_MW": 748.4132,
                "LRT_MW": 13618.365,
                "LSCRA_MW": 13665.2613,
                "IRT_MW": -870,
                "ISCRA_MW": 507
            },
            {
                "HR": "2024-11-13 06:35:00",
                "SRT_MW": 0.4,
                "SSCRA_MW": 62.8334,
                "WRT_MW": 777.8,
                "WSCRA_MW": 747.3314,
                "LRT_MW": 13798.288,
                "LSCRA_MW": 13689.3031,
                "IRT_MW": -870,
                "ISCRA_MW": 507
            },
            {
                "HR": "2024-11-13 06:40:00",
                "SRT_MW": 2.5,
                "SSCRA_MW": 75.4794,
                "WRT_MW": 776.6,
                "WSCRA_MW": 746.2495,
                "LRT_MW": 13843.509,
                "LSCRA_MW": 13713.3449,
                "IRT_MW": -870,
                "ISCRA_MW": 507
            },
            {
                "HR": "2024-11-13 06:45:00",
                "SRT_MW": 4.6,
                "SSCRA_MW": 88.1254,
                "WRT_MW": 787.1,
                "WSCRA_MW": 745.1676,
                "LRT_MW": 13889.082,
                "LSCRA_MW": 13737.3868,
                "IRT_MW": -1026,
                "ISCRA_MW": 507
            },
            {
                "HR": "2024-11-13 06:50:00",
                "SRT_MW": 10.3,
                "SSCRA_MW": 100.7714,
                "WRT_MW": 784.4,
                "WSCRA_MW": 744.0857,
                "LRT_MW": 13991.396,
                "LSCRA_MW": 13761.4286,
                "IRT_MW": -1026,
                "ISCRA_MW": 507
            },
            {
                "HR": "2024-11-13 06:55:00",
                "SRT_MW": 17.9,
                "SSCRA_MW": 113.4174,
                "WRT_MW": 778.7,
                "WSCRA_MW": 743.0038,
                "LRT_MW": 14063.75,
                "LSCRA_MW": 13785.4704,
                "IRT_MW": -1026,
                "ISCRA_MW": 507
            },
            {
                "HR": "2024-11-13 07:00:00",
                "SRT_MW": 26.9,
                "SSCRA_MW": 126.0634,
                "WRT_MW": 772.1,
                "WSCRA_MW": 741.922,
                "LRT_MW": 14036.277,
                "LSCRA_MW": 13809.5122,
                "IRT_MW": -975,
                "ISCRA_MW": 402
            },
            {
                "HR": "2024-11-13 07:05:00",
                "SRT_MW": 39,
                "SSCRA_MW": 138.7094,
                "WRT_MW": 772.6,
                "WSCRA_MW": 740.8401,
                "LRT_MW": 14126.963,
                "LSCRA_MW": 13833.554,
                "IRT_MW": -975,
                "ISCRA_MW": 402
            },
            {
                "HR": "2024-11-13 07:10:00",
                "SRT_MW": 53,
                "SSCRA_MW": 151.3554,
                "WRT_MW": 737.6,
                "WSCRA_MW": 739.7582,
                "LRT_MW": 14177.979,
                "LSCRA_MW": 13857.5958,
                "IRT_MW": -975,
                "ISCRA_MW": 402
            },
            {
                "HR": "2024-11-13 07:15:00",
                "SRT_MW": 70.4,
                "SSCRA_MW": 164.0014,
                "WRT_MW": 763.7,
                "WSCRA_MW": 738.6763,
                "LRT_MW": 14149.67,
                "LSCRA_MW": 13881.6376,
                "IRT_MW": -675,
                "ISCRA_MW": 402
            },
            {
                "HR": "2024-11-13 07:20:00",
                "SRT_MW": 87.7,
                "SSCRA_MW": 183.4784,
                "WRT_MW": 749.8,
                "WSCRA_MW": 734.0091,
                "LRT_MW": 14035.692,
                "LSCRA_MW": 13828.8502,
                "IRT_MW": -675,
                "ISCRA_MW": 402
            },
            {
                "HR": "2024-11-13 07:25:00",
                "SRT_MW": 106.1,
                "SSCRA_MW": 206.5986,
                "WRT_MW": 728.4,
                "WSCRA_MW": 727.4296,
                "LRT_MW": 14015.991,
                "LSCRA_MW": 13735.0871,
                "IRT_MW": -675,
                "ISCRA_MW": 402
            },
            {
                "HR": "2024-11-13 07:30:00",
                "SRT_MW": 126.4,
                "SSCRA_MW": 229.7188,
                "WRT_MW": 729.5,
                "WSCRA_MW": 720.8502,
                "LRT_MW": 13932.159,
                "LSCRA_MW": 13641.324,
                "IRT_MW": -563,
                "ISCRA_MW": 402
            },
            {
                "HR": "2024-11-13 07:35:00",
                "SRT_MW": 148.7,
                "SSCRA_MW": 252.839,
                "WRT_MW": 710.5,
                "WSCRA_MW": 714.2707,
                "LRT_MW": 13855.507,
                "LSCRA_MW": 13547.561,
                "IRT_MW": -563,
                "ISCRA_MW": 402
            },
            {
                "HR": "2024-11-13 07:40:00",
                "SRT_MW": 171.8,
                "SSCRA_MW": 275.9592,
                "WRT_MW": 718,
                "WSCRA_MW": 707.6913,
                "LRT_MW": 13796.95,
                "LSCRA_MW": 13453.7979,
                "IRT_MW": -563,
                "ISCRA_MW": 402
            },
            {
                "HR": "2024-11-13 07:45:00",
                "SRT_MW": 194.7,
                "SSCRA_MW": 299.0794,
                "WRT_MW": 715.7,
                "WSCRA_MW": 701.1118,
                "LRT_MW": 13655.792,
                "LSCRA_MW": 13360.0348,
                "IRT_MW": -642,
                "ISCRA_MW": 402
            },
            {
                "HR": "2024-11-13 07:50:00",
                "SRT_MW": 216.9,
                "SSCRA_MW": 322.1997,
                "WRT_MW": 719.5,
                "WSCRA_MW": 694.5324,
                "LRT_MW": 13536.59,
                "LSCRA_MW": 13266.2718,
                "IRT_MW": -642,
                "ISCRA_MW": 402
            },
            {
                "HR": "2024-11-13 07:55:00",
                "SRT_MW": 240.4,
                "SSCRA_MW": 345.3199,
                "WRT_MW": 728.8,
                "WSCRA_MW": 687.953,
                "LRT_MW": 13355.65,
                "LSCRA_MW": 13172.5087,
                "IRT_MW": -642,
                "ISCRA_MW": 402
            },
            {
                "HR": "2024-11-13 08:00:00",
                "SRT_MW": 264.2,
                "SSCRA_MW": 368.4401,
                "WRT_MW": 731.7,
                "WSCRA_MW": 681.3735,
                "LRT_MW": 13314.369,
                "LSCRA_MW": 13078.7456,
                "IRT_MW": -185,
                "ISCRA_MW": 116
            },
            {
                "HR": "2024-11-13 08:05:00",
                "SRT_MW": 289.5,
                "SSCRA_MW": 391.5603,
                "WRT_MW": 755.7,
                "WSCRA_MW": 674.7941,
                "LRT_MW": 13154.438,
                "LSCRA_MW": 12984.9826,
                "IRT_MW": -185,
                "ISCRA_MW": 116
            },
            {
                "HR": "2024-11-13 08:10:00",
                "SRT_MW": 310.8,
                "SSCRA_MW": 414.6805,
                "WRT_MW": 745.4,
                "WSCRA_MW": 668.2146,
                "LRT_MW": 13111.76,
                "LSCRA_MW": 12891.2195,
                "IRT_MW": -185,
                "ISCRA_MW": 116
            },
            {
                "HR": "2024-11-13 08:15:00",
                "SRT_MW": 337.5,
                "SSCRA_MW": 437.8007,
                "WRT_MW": 728.8,
                "WSCRA_MW": 661.6352,
                "LRT_MW": 12995.966,
                "LSCRA_MW": 12797.4564,
                "IRT_MW": -250,
                "ISCRA_MW": 116
            },
            {
                "HR": "2024-11-13 08:20:00",
                "SRT_MW": 360.4,
                "SSCRA_MW": 459.3669,
                "WRT_MW": 723.5,
                "WSCRA_MW": 655.846,
                "LRT_MW": 12884.463,
                "LSCRA_MW": 12698.8153,
                "IRT_MW": -250,
                "ISCRA_MW": 116
            },
            {
                "HR": "2024-11-13 08:25:00",
                "SRT_MW": 379.5,
                "SSCRA_MW": 473.5516,
                "WRT_MW": 720.9,
                "WSCRA_MW": 653.8105,
                "LRT_MW": 12727.176,
                "LSCRA_MW": 12577.0035,
                "IRT_MW": -250,
                "ISCRA_MW": 116
            },
            {
                "HR": "2024-11-13 08:30:00",
                "SRT_MW": 403.5,
                "SSCRA_MW": 487.7362,
                "WRT_MW": 705.9,
                "WSCRA_MW": 651.7749,
                "LRT_MW": 12601.723,
                "LSCRA_MW": 12455.1916,
                "IRT_MW": -425,
                "ISCRA_MW": 116
            },
            {
                "HR": "2024-11-13 08:35:00",
                "SRT_MW": 423,
                "SSCRA_MW": 501.9209,
                "WRT_MW": 685.9,
                "WSCRA_MW": 649.7394,
                "LRT_MW": 12416.025,
                "LSCRA_MW": 12333.3798,
                "IRT_MW": -425,
                "ISCRA_MW": 116
            },
            {
                "HR": "2024-11-13 08:40:00",
                "SRT_MW": 439.1,
                "SSCRA_MW": 516.1056,
                "WRT_MW": 691.6,
                "WSCRA_MW": 647.7038,
                "LRT_MW": 12331.494,
                "LSCRA_MW": 12211.5679,
                "IRT_MW": -425,
                "ISCRA_MW": 116
            },
            {
                "HR": "2024-11-13 08:45:00",
                "SRT_MW": 455.7,
                "SSCRA_MW": 530.2902,
                "WRT_MW": 691.9,
                "WSCRA_MW": 645.6683,
                "LRT_MW": 12234.433,
                "LSCRA_MW": 12089.7561,
                "IRT_MW": -206,
                "ISCRA_MW": 116
            },
            {
                "HR": "2024-11-13 08:50:00",
                "SRT_MW": 477.7,
                "SSCRA_MW": 544.4749,
                "WRT_MW": 663.7,
                "WSCRA_MW": 643.6328,
                "LRT_MW": 12082.265,
                "LSCRA_MW": 11967.9443,
                "IRT_MW": -206,
                "ISCRA_MW": 116
            },
            {
                "HR": "2024-11-13 08:55:00",
                "SRT_MW": 497.3,
                "SSCRA_MW": 558.6596,
                "WRT_MW": 658.6,
                "WSCRA_MW": 641.5972,
                "LRT_MW": 11974.869,
                "LSCRA_MW": 11846.1324,
                "IRT_MW": -206,
                "ISCRA_MW": 116
            },
            {
                "HR": "2024-11-13 09:00:00",
                "SRT_MW": 504.4,
                "SSCRA_MW": 572.8443,
                "WRT_MW": 660.7,
                "WSCRA_MW": 639.5617,
                "LRT_MW": 11833.704,
                "LSCRA_MW": 11724.3206,
                "IRT_MW": -381,
                "ISCRA_MW": -434
            },
            {
                "HR": "2024-11-13 09:05:00",
                "SRT_MW": 523.1,
                "SSCRA_MW": 587.0289,
                "WRT_MW": 639.3,
                "WSCRA_MW": 637.5261,
                "LRT_MW": 11733.485,
                "LSCRA_MW": 11602.5087,
                "IRT_MW": -381,
                "ISCRA_MW": -434
            },
            {
                "HR": "2024-11-13 09:10:00",
                "SRT_MW": 539.6,
                "SSCRA_MW": 601.2136,
                "WRT_MW": 641.6,
                "WSCRA_MW": 635.4906,
                "LRT_MW": 11573.912,
                "LSCRA_MW": 11480.6969,
                "IRT_MW": -381,
                "ISCRA_MW": -434
            },
            {
                "HR": "2024-11-13 09:15:00",
                "SRT_MW": 549.3,
                "SSCRA_MW": 615.3983,
                "WRT_MW": 648.8,
                "WSCRA_MW": 633.4551,
                "LRT_MW": 11486.569,
                "LSCRA_MW": 11358.885,
                "IRT_MW": -163,
                "ISCRA_MW": -434
            },
            {
                "HR": "2024-11-13 09:20:00",
                "SRT_MW": 562.2,
                "SSCRA_MW": 629.5829,
                "WRT_MW": 627,
                "WSCRA_MW": 631.4195,
                "LRT_MW": 11398.968,
                "LSCRA_MW": 11237.0732,
                "IRT_MW": -163,
                "ISCRA_MW": -434
            },
            {
                "HR": "2024-11-13 09:25:00",
                "SRT_MW": 568.5,
                "SSCRA_MW": 637.0833,
                "WRT_MW": 625.1,
                "WSCRA_MW": 627.7059,
                "LRT_MW": 11289.758,
                "LSCRA_MW": 11155.9582,
                "IRT_MW": -163,
                "ISCRA_MW": -434
            },
            {
                "HR": "2024-11-13 09:30:00",
                "SRT_MW": 579.1,
                "SSCRA_MW": 641.6592,
                "WRT_MW": 614.8,
                "WSCRA_MW": 623.2582,
                "LRT_MW": 11241.345,
                "LSCRA_MW": 11092.6481,
                "IRT_MW": -156,
                "ISCRA_MW": -434
            },
            {
                "HR": "2024-11-13 09:35:00",
                "SRT_MW": 593.2,
                "SSCRA_MW": 646.2352,
                "WRT_MW": 601.6,
                "WSCRA_MW": 618.8105,
                "LRT_MW": 11150.415,
                "LSCRA_MW": 11029.338,
                "IRT_MW": -156,
                "ISCRA_MW": -434
            },
            {
                "HR": "2024-11-13 09:40:00",
                "SRT_MW": 596.1,
                "SSCRA_MW": 650.8111,
                "WRT_MW": 587.3,
                "WSCRA_MW": 614.3627,
                "LRT_MW": 11047.001,
                "LSCRA_MW": 10966.0279,
                "IRT_MW": -156,
                "ISCRA_MW": -434
            },
            {
                "HR": "2024-11-13 09:45:00",
                "SRT_MW": 608.3,
                "SSCRA_MW": 655.3871,
                "WRT_MW": 590.5,
                "WSCRA_MW": 609.915,
                "LRT_MW": 10919.256,
                "LSCRA_MW": 10902.7178,
                "IRT_MW": -72,
                "ISCRA_MW": -434
            },
            {
                "HR": "2024-11-13 09:50:00",
                "SRT_MW": 611.1,
                "SSCRA_MW": 659.9631,
                "WRT_MW": 568.4,
                "WSCRA_MW": 605.4672,
                "LRT_MW": 10915.622,
                "LSCRA_MW": 10839.4077,
                "IRT_MW": -72,
                "ISCRA_MW": -434
            },
            {
                "HR": "2024-11-13 09:55:00",
                "SRT_MW": 622.9,
                "SSCRA_MW": 664.539,
                "WRT_MW": 557.9,
                "WSCRA_MW": 601.0195,
                "LRT_MW": 10848.049,
                "LSCRA_MW": 10776.0976,
                "IRT_MW": -72,
                "ISCRA_MW": -434
            },
            {
                "HR": "2024-11-13 10:00:00",
                "SRT_MW": 630.1,
                "SSCRA_MW": 669.115,
                "WRT_MW": 560.2,
                "WSCRA_MW": 596.5718,
                "LRT_MW": 10778.405,
                "LSCRA_MW": 10712.7875,
                "IRT_MW": 192,
                "ISCRA_MW": -447
            },
            {
                "HR": "2024-11-13 10:05:00",
                "SRT_MW": 634.4,
                "SSCRA_MW": 673.6909,
                "WRT_MW": 541.5,
                "WSCRA_MW": 592.124,
                "LRT_MW": 10673.069,
                "LSCRA_MW": 10649.4774,
                "IRT_MW": 192,
                "ISCRA_MW": -447
            },
            {
                "HR": "2024-11-13 10:10:00",
                "SRT_MW": 638.3,
                "SSCRA_MW": 678.2669,
                "WRT_MW": 538.4,
                "WSCRA_MW": 587.6763,
                "LRT_MW": 10601.569,
                "LSCRA_MW": 10586.1672,
                "IRT_MW": 192,
                "ISCRA_MW": -447
            },
            {
                "HR": "2024-11-13 10:15:00",
                "SRT_MW": 643.2,
                "SSCRA_MW": 682.8429,
                "WRT_MW": 554.9,
                "WSCRA_MW": 583.2286,
                "LRT_MW": 10554.902,
                "LSCRA_MW": 10522.8571,
                "IRT_MW": 323,
                "ISCRA_MW": -447
            },
            {
                "HR": "2024-11-13 10:20:00",
                "SRT_MW": 649.4,
                "SSCRA_MW": 687.4188,
                "WRT_MW": 557.1,
                "WSCRA_MW": 578.7808,
                "LRT_MW": 10507.409,
                "LSCRA_MW": 10459.547,
                "IRT_MW": 323,
                "ISCRA_MW": -447
            },
            {
                "HR": "2024-11-13 10:25:00",
                "SRT_MW": 652.6,
                "SSCRA_MW": 691.1411,
                "WRT_MW": 532.6,
                "WSCRA_MW": 574.4185,
                "LRT_MW": 10470.492,
                "LSCRA_MW": 10402.6829,
                "IRT_MW": 323,
                "ISCRA_MW": -447
            },
            {
                "HR": "2024-11-13 10:30:00",
                "SRT_MW": 659,
                "SSCRA_MW": 691.7902,
                "WRT_MW": 554,
                "WSCRA_MW": 570.3634,
                "LRT_MW": 10442.702,
                "LSCRA_MW": 10369.0244,
                "IRT_MW": 192,
                "ISCRA_MW": -447
            },
            {
                "HR": "2024-11-13 10:35:00",
                "SRT_MW": 659.8,
                "SSCRA_MW": 692.4394,
                "WRT_MW": 559.2,
                "WSCRA_MW": 566.3084,
                "LRT_MW": 10399.469,
                "LSCRA_MW": 10335.3659,
                "IRT_MW": 192,
                "ISCRA_MW": -447
            },
            {
                "HR": "2024-11-13 10:40:00",
                "SRT_MW": 662.4,
                "SSCRA_MW": 693.0885,
                "WRT_MW": 549.3,
                "WSCRA_MW": 562.2533,
                "LRT_MW": 10354.488,
                "LSCRA_MW": 10301.7073,
                "IRT_MW": 192,
                "ISCRA_MW": -447
            },
            {
                "HR": "2024-11-13 10:45:00",
                "SRT_MW": 665.5,
                "SSCRA_MW": 693.7376,
                "WRT_MW": 523.5,
                "WSCRA_MW": 558.1983,
                "LRT_MW": 10341.543,
                "LSCRA_MW": 10268.0488,
                "IRT_MW": 192,
                "ISCRA_MW": -447
            },
            {
                "HR": "2024-11-13 10:50:00",
                "SRT_MW": 666.7,
                "SSCRA_MW": 694.3868,
                "WRT_MW": 520.1,
                "WSCRA_MW": 554.1432,
                "LRT_MW": 10284.618,
                "LSCRA_MW": 10234.3902,
                "IRT_MW": 192,
                "ISCRA_MW": -447
            },
            {
                "HR": "2024-11-13 10:55:00",
                "SRT_MW": 661.3,
                "SSCRA_MW": 695.0359,
                "WRT_MW": 524.3,
                "WSCRA_MW": 550.0882,
                "LRT_MW": 10242.531,
                "LSCRA_MW": 10200.7317,
                "IRT_MW": 192,
                "ISCRA_MW": -447
            },
            {
                "HR": "2024-11-13 11:00:00",
                "SRT_MW": 663.4,
                "SSCRA_MW": 695.685,
                "WRT_MW": 520.2,
                "WSCRA_MW": 546.0331,
                "LRT_MW": 10222.169,
                "LSCRA_MW": 10167.0732,
                "IRT_MW": 232,
                "ISCRA_MW": -299
            },
            {
                "HR": "2024-11-13 11:05:00",
                "SRT_MW": 664.8,
                "SSCRA_MW": 696.3341,
                "WRT_MW": 534.9,
                "WSCRA_MW": 541.978,
                "LRT_MW": 10201.121,
                "LSCRA_MW": 10133.4146,
                "IRT_MW": 232,
                "ISCRA_MW": -299
            },
            {
                "HR": "2024-11-13 11:10:00",
                "SRT_MW": 662.4,
                "SSCRA_MW": 696.9833,
                "WRT_MW": 517.8,
                "WSCRA_MW": 537.923,
                "LRT_MW": 10185.297,
                "LSCRA_MW": 10099.7561,
                "IRT_MW": 232,
                "ISCRA_MW": -299
            },
            {
                "HR": "2024-11-13 11:15:00",
                "SRT_MW": 664.7,
                "SSCRA_MW": 697.6324,
                "WRT_MW": 522.7,
                "WSCRA_MW": 533.8679,
                "LRT_MW": 10167.492,
                "LSCRA_MW": 10066.0976,
                "IRT_MW": -15,
                "ISCRA_MW": -299
            },
            {
                "HR": "2024-11-13 11:20:00",
                "SRT_MW": 649.7,
                "SSCRA_MW": 698.2815,
                "WRT_MW": 513.7,
                "WSCRA_MW": 529.8129,
                "LRT_MW": 10115.338,
                "LSCRA_MW": 10032.439,
                "IRT_MW": -15,
                "ISCRA_MW": -299
            },
            {
                "HR": "2024-11-13 11:25:00",
                "SRT_MW": 649.7,
                "SSCRA_MW": 698.9307,
                "WRT_MW": 512.2,
                "WSCRA_MW": 525.7578,
                "LRT_MW": 10086.193,
                "LSCRA_MW": 9998.7805,
                "IRT_MW": -15,
                "ISCRA_MW": -299
            },
            {
                "HR": "2024-11-13 11:30:00",
                "SRT_MW": 643,
                "SSCRA_MW": 698.9875,
                "WRT_MW": 508.2,
                "WSCRA_MW": 524.1551,
                "LRT_MW": 10065.52,
                "LSCRA_MW": 9990.5923,
                "IRT_MW": -15,
                "ISCRA_MW": -299
            },
            {
                "HR": "2024-11-13 11:35:00",
                "SRT_MW": 650.1,
                "SSCRA_MW": 698.8352,
                "WRT_MW": 501.7,
                "WSCRA_MW": 523.4178,
                "LRT_MW": 10015.667,
                "LSCRA_MW": 9991.3937,
                "IRT_MW": -15,
                "ISCRA_MW": -299
            },
            {
                "HR": "2024-11-13 11:40:00",
                "SRT_MW": 649.5,
                "SSCRA_MW": 698.6829,
                "WRT_MW": 490.9,
                "WSCRA_MW": 522.6805,
                "LRT_MW": 9988.238,
                "LSCRA_MW": 9992.1951,
                "IRT_MW": -15,
                "ISCRA_MW": -299
            },
            {
                "HR": "2024-11-13 11:45:00",
                "SRT_MW": 643.8,
                "SSCRA_MW": 698.5307,
                "WRT_MW": 485.2,
                "WSCRA_MW": 521.9432,
                "LRT_MW": 10024.968,
                "LSCRA_MW": 9992.9965,
                "IRT_MW": 21,
                "ISCRA_MW": -299
            },
            {
                "HR": "2024-11-13 11:50:00",
                "SRT_MW": 645.6,
                "SSCRA_MW": 698.3784,
                "WRT_MW": 469,
                "WSCRA_MW": 521.2059,
                "LRT_MW": 9986.044,
                "LSCRA_MW": 9993.7979,
                "IRT_MW": 21,
                "ISCRA_MW": -299
            },
            {
                "HR": "2024-11-13 11:55:00",
                "SRT_MW": 645.4,
                "SSCRA_MW": 698.2261,
                "WRT_MW": 476.1,
                "WSCRA_MW": 520.4686,
                "LRT_MW": 9951.03,
                "LSCRA_MW": 9994.5993,
                "IRT_MW": 21,
                "ISCRA_MW": -299
            },
            {
                "HR": "2024-11-13 12:00:00",
                "SRT_MW": 647,
                "SSCRA_MW": 698.0739,
                "WRT_MW": 471.5,
                "WSCRA_MW": 519.7314,
                "LRT_MW": 9935.203,
                "LSCRA_MW": 9995.4007,
                "IRT_MW": 46,
                "ISCRA_MW": -162
            },
            {
                "HR": "2024-11-13 12:05:00",
                "SRT_MW": 622.1,
                "SSCRA_MW": 697.9216,
                "WRT_MW": 463,
                "WSCRA_MW": 518.9941,
                "LRT_MW": 9908.259,
                "LSCRA_MW": 9996.2021,
                "IRT_MW": 46,
                "ISCRA_MW": -162
            },
            {
                "HR": "2024-11-13 12:10:00",
                "SRT_MW": 629.5,
                "SSCRA_MW": 697.7693,
                "WRT_MW": 482.3,
                "WSCRA_MW": 518.2568,
                "LRT_MW": 9955.531,
                "LSCRA_MW": 9997.0035,
                "IRT_MW": 46,
                "ISCRA_MW": -162
            },
            {
                "HR": "2024-11-13 12:15:00",
                "SRT_MW": 634.4,
                "SSCRA_MW": 697.6171,
                "WRT_MW": 464.4,
                "WSCRA_MW": 517.5195,
                "LRT_MW": 9959.249,
                "LSCRA_MW": 9997.8049,
                "IRT_MW": 228,
                "ISCRA_MW": -162
            },
            {
                "HR": "2024-11-13 12:20:00",
                "SRT_MW": 638.5,
                "SSCRA_MW": 697.4648,
                "WRT_MW": 476.6,
                "WSCRA_MW": 516.7822,
                "LRT_MW": 9985.508,
                "LSCRA_MW": 9998.6063,
                "IRT_MW": 228,
                "ISCRA_MW": -162
            },
            {
                "HR": "2024-11-13 12:25:00",
                "SRT_MW": 639.2,
                "SSCRA_MW": 697.3125,
                "WRT_MW": 475.4,
                "WSCRA_MW": 516.0449,
                "LRT_MW": 9975.289,
                "LSCRA_MW": 9999.4077,
                "IRT_MW": 228,
                "ISCRA_MW": -162
            },
            {
                "HR": "2024-11-13 12:30:00",
                "SRT_MW": 644,
                "SSCRA_MW": 696.299,
                "WRT_MW": 440.5,
                "WSCRA_MW": 514.9293,
                "LRT_MW": 9969.273,
                "LSCRA_MW": 10013.1707,
                "IRT_MW": 148,
                "ISCRA_MW": -162
            },
            {
                "HR": "2024-11-13 12:35:00",
                "SRT_MW": 644.1,
                "SSCRA_MW": 692.8449,
                "WRT_MW": 448.3,
                "WSCRA_MW": 512.7415,
                "LRT_MW": 9978.603,
                "LSCRA_MW": 10063.6585,
                "IRT_MW": 148,
                "ISCRA_MW": -162
            },
            {
                "HR": "2024-11-13 12:40:00",
                "SRT_MW": 641.7,
                "SSCRA_MW": 689.3909,
                "WRT_MW": 438.4,
                "WSCRA_MW": 510.5537,
                "LRT_MW": 10016.594,
                "LSCRA_MW": 10114.1463,
                "IRT_MW": 148,
                "ISCRA_MW": -162
            },
            {
                "HR": "2024-11-13 12:45:00",
                "SRT_MW": 636.1,
                "SSCRA_MW": 685.9369,
                "WRT_MW": 451.7,
                "WSCRA_MW": 508.3659,
                "LRT_MW": 10106.346,
                "LSCRA_MW": 10164.6341,
                "IRT_MW": 147,
                "ISCRA_MW": -162
            },
            {
                "HR": "2024-11-13 12:50:00",
                "SRT_MW": 627.4,
                "SSCRA_MW": 682.4829,
                "WRT_MW": 451.2,
                "WSCRA_MW": 506.178,
                "LRT_MW": 10113.064,
                "LSCRA_MW": 10215.122,
                "IRT_MW": 147,
                "ISCRA_MW": -162
            },
            {
                "HR": "2024-11-13 12:55:00",
                "SRT_MW": 626.5,
                "SSCRA_MW": 679.0289,
                "WRT_MW": 466.4,
                "WSCRA_MW": 503.9902,
                "LRT_MW": 10144.516,
                "LSCRA_MW": 10265.6098,
                "IRT_MW": 147,
                "ISCRA_MW": -162
            },
            {
                "HR": "2024-11-13 13:00:00",
                "SRT_MW": 620.1,
                "SSCRA_MW": 675.5749,
                "WRT_MW": 461.3,
                "WSCRA_MW": 501.8024,
                "LRT_MW": 10209.4,
                "LSCRA_MW": 10316.0976,
                "IRT_MW": 22,
                "ISCRA_MW": -68
            },
            {
                "HR": "2024-11-13 13:05:00",
                "SRT_MW": 612.1,
                "SSCRA_MW": 672.1209,
                "WRT_MW": 443.6,
                "WSCRA_MW": 499.6146,
                "LRT_MW": 10292.183,
                "LSCRA_MW": 10366.5854,
                "IRT_MW": 22,
                "ISCRA_MW": -68
            },
            {
                "HR": "2024-11-13 13:10:00",
                "SRT_MW": 602.4,
                "SSCRA_MW": 668.6669,
                "WRT_MW": 444,
                "WSCRA_MW": 497.4268,
                "LRT_MW": 10304.987,
                "LSCRA_MW": 10417.0732,
                "IRT_MW": 22,
                "ISCRA_MW": -68
            },
            {
                "HR": "2024-11-13 13:15:00",
                "SRT_MW": 595.4,
                "SSCRA_MW": 665.2129,
                "WRT_MW": 463.3,
                "WSCRA_MW": 495.239,
                "LRT_MW": 10454.209,
                "LSCRA_MW": 10467.561,
                "IRT_MW": 22,
                "ISCRA_MW": -68
            },
            {
                "HR": "2024-11-13 13:20:00",
                "SRT_MW": 586.4,
                "SSCRA_MW": 661.7589,
                "WRT_MW": 470.6,
                "WSCRA_MW": 493.0512,
                "LRT_MW": 10436.681,
                "LSCRA_MW": 10518.0488,
                "IRT_MW": 22,
                "ISCRA_MW": -68
            },
            {
                "HR": "2024-11-13 13:25:00",
                "SRT_MW": 576.7,
                "SSCRA_MW": 658.3049,
                "WRT_MW": 442.7,
                "WSCRA_MW": 490.8634,
                "LRT_MW": 10486.698,
                "LSCRA_MW": 10568.5366,
                "IRT_MW": 22,
                "ISCRA_MW": -68
            },
            {
                "HR": "2024-11-13 13:30:00",
                "SRT_MW": 566.7,
                "SSCRA_MW": 654.8509,
                "WRT_MW": 459.7,
                "WSCRA_MW": 488.6756,
                "LRT_MW": 10557.371,
                "LSCRA_MW": 10619.0244,
                "IRT_MW": -55,
                "ISCRA_MW": -68
            },
            {
                "HR": "2024-11-13 13:35:00",
                "SRT_MW": 556.3,
                "SSCRA_MW": 645.6645,
                "WRT_MW": 456.8,
                "WSCRA_MW": 487.6355,
                "LRT_MW": 10695.485,
                "LSCRA_MW": 10705.2613,
                "IRT_MW": -55,
                "ISCRA_MW": -68
            },
            {
                "HR": "2024-11-13 13:40:00",
                "SRT_MW": 543.4,
                "SSCRA_MW": 634.8857,
                "WRT_MW": 440.8,
                "WSCRA_MW": 486.9143,
                "LRT_MW": 10734.114,
                "LSCRA_MW": 10801.4286,
                "IRT_MW": -55,
                "ISCRA_MW": -68
            },
            {
                "HR": "2024-11-13 13:45:00",
                "SRT_MW": 529.2,
                "SSCRA_MW": 624.107,
                "WRT_MW": 474.7,
                "WSCRA_MW": 486.193,
                "LRT_MW": 10782.528,
                "LSCRA_MW": 10897.5958,
                "IRT_MW": 22,
                "ISCRA_MW": -68
            },
            {
                "HR": "2024-11-13 13:50:00",
                "SRT_MW": 513.8,
                "SSCRA_MW": 613.3282,
                "WRT_MW": 458.9,
                "WSCRA_MW": 485.4718,
                "LRT_MW": 10852.602,
                "LSCRA_MW": 10993.7631,
                "IRT_MW": 22,
                "ISCRA_MW": -68
            },
            {
                "HR": "2024-11-13 13:55:00",
                "SRT_MW": 499.7,
                "SSCRA_MW": 602.5495,
                "WRT_MW": 475.1,
                "WSCRA_MW": 484.7505,
                "LRT_MW": 10952.002,
                "LSCRA_MW": 11089.9303,
                "IRT_MW": 22,
                "ISCRA_MW": -68
            },
            {
                "HR": "2024-11-13 14:00:00",
                "SRT_MW": 488,
                "SSCRA_MW": 591.7707,
                "WRT_MW": 464.2,
                "WSCRA_MW": 484.0293,
                "LRT_MW": 11116.817,
                "LSCRA_MW": 11186.0976,
                "IRT_MW": -124,
                "ISCRA_MW": 47
            },
            {
                "HR": "2024-11-13 14:05:00",
                "SRT_MW": 471.4,
                "SSCRA_MW": 580.992,
                "WRT_MW": 451.5,
                "WSCRA_MW": 483.308,
                "LRT_MW": 11199.96,
                "LSCRA_MW": 11282.2648,
                "IRT_MW": -124,
                "ISCRA_MW": 47
            },
            {
                "HR": "2024-11-13 14:10:00",
                "SRT_MW": 455.8,
                "SSCRA_MW": 570.2132,
                "WRT_MW": 468.6,
                "WSCRA_MW": 482.5868,
                "LRT_MW": 11268.575,
                "LSCRA_MW": 11378.4321,
                "IRT_MW": -124,
                "ISCRA_MW": 47
            },
            {
                "HR": "2024-11-13 14:15:00",
                "SRT_MW": 438.9,
                "SSCRA_MW": 559.4345,
                "WRT_MW": 465.5,
                "WSCRA_MW": 481.8655,
                "LRT_MW": 11435.506,
                "LSCRA_MW": 11474.5993,
                "IRT_MW": -87,
                "ISCRA_MW": 47
            },
            {
                "HR": "2024-11-13 14:20:00",
                "SRT_MW": 419.9,
                "SSCRA_MW": 548.6557,
                "WRT_MW": 466.7,
                "WSCRA_MW": 481.1443,
                "LRT_MW": 11538.613,
                "LSCRA_MW": 11570.7666,
                "IRT_MW": -87,
                "ISCRA_MW": 47
            },
            {
                "HR": "2024-11-13 14:25:00",
                "SRT_MW": 401.2,
                "SSCRA_MW": 537.877,
                "WRT_MW": 469.8,
                "WSCRA_MW": 480.423,
                "LRT_MW": 11590.388,
                "LSCRA_MW": 11666.9338,
                "IRT_MW": -87,
                "ISCRA_MW": 47
            },
            {
                "HR": "2024-11-13 14:30:00",
                "SRT_MW": 381.5,
                "SSCRA_MW": 527.0983,
                "WRT_MW": 473.5,
                "WSCRA_MW": 479.7017,
                "LRT_MW": 11804.526,
                "LSCRA_MW": 11763.101,
                "IRT_MW": -185,
                "ISCRA_MW": 47
            },
            {
                "HR": "2024-11-13 14:35:00",
                "SRT_MW": 359.3,
                "SSCRA_MW": 512.8146,
                "WRT_MW": 455,
                "WSCRA_MW": 478.7195,
                "LRT_MW": 11839.662,
                "LSCRA_MW": 11867.3171,
                "IRT_MW": -185,
                "ISCRA_MW": 47
            },
            {
                "HR": "2024-11-13 14:40:00",
                "SRT_MW": 337.4,
                "SSCRA_MW": 490.5199,
                "WRT_MW": 456.1,
                "WSCRA_MW": 477.1408,
                "LRT_MW": 12098.01,
                "LSCRA_MW": 11989.9303,
                "IRT_MW": -185,
                "ISCRA_MW": 47
            },
            {
                "HR": "2024-11-13 14:45:00",
                "SRT_MW": 313.5,
                "SSCRA_MW": 468.2251,
                "WRT_MW": 461.6,
                "WSCRA_MW": 475.562,
                "LRT_MW": 12208.464,
                "LSCRA_MW": 12112.5436,
                "IRT_MW": -132,
                "ISCRA_MW": 47
            },
            {
                "HR": "2024-11-13 14:50:00",
                "SRT_MW": 289.7,
                "SSCRA_MW": 445.9303,
                "WRT_MW": 454.1,
                "WSCRA_MW": 473.9833,
                "LRT_MW": 12286.232,
                "LSCRA_MW": 12235.1568,
                "IRT_MW": -132,
                "ISCRA_MW": 47
            },
            {
                "HR": "2024-11-13 14:55:00",
                "SRT_MW": 265,
                "SSCRA_MW": 423.6355,
                "WRT_MW": 448.8,
                "WSCRA_MW": 472.4045,
                "LRT_MW": 12430.301,
                "LSCRA_MW": 12357.77,
                "IRT_MW": -132,
                "ISCRA_MW": 47
            },
            {
                "HR": "2024-11-13 15:00:00",
                "SRT_MW": 241.4,
                "SSCRA_MW": 401.3408,
                "WRT_MW": 451.8,
                "WSCRA_MW": 470.8258,
                "LRT_MW": 12547.119,
                "LSCRA_MW": 12480.3833,
                "IRT_MW": -491,
                "ISCRA_MW": 416
            },
            {
                "HR": "2024-11-13 15:05:00",
                "SRT_MW": 218.2,
                "SSCRA_MW": 379.046,
                "WRT_MW": 453.3,
                "WSCRA_MW": 469.247,
                "LRT_MW": 12870.036,
                "LSCRA_MW": 12602.9965,
                "IRT_MW": -491,
                "ISCRA_MW": 416
            },
            {
                "HR": "2024-11-13 15:10:00",
                "SRT_MW": 194.6,
                "SSCRA_MW": 356.7512,
                "WRT_MW": 452.5,
                "WSCRA_MW": 467.6683,
                "LRT_MW": 12962.518,
                "LSCRA_MW": 12725.6098,
                "IRT_MW": -491,
                "ISCRA_MW": 416
            },
            {
                "HR": "2024-11-13 15:15:00",
                "SRT_MW": 171.4,
                "SSCRA_MW": 334.4564,
                "WRT_MW": 460.6,
                "WSCRA_MW": 466.0895,
                "LRT_MW": 13077.358,
                "LSCRA_MW": 12848.223,
                "IRT_MW": -491,
                "ISCRA_MW": 416
            },
            {
                "HR": "2024-11-13 15:20:00",
                "SRT_MW": 149.4,
                "SSCRA_MW": 312.1617,
                "WRT_MW": 443.2,
                "WSCRA_MW": 464.5108,
                "LRT_MW": 13272.129,
                "LSCRA_MW": 12970.8362,
                "IRT_MW": -491,
                "ISCRA_MW": 416
            },
            {
                "HR": "2024-11-13 15:25:00",
                "SRT_MW": 125.2,
                "SSCRA_MW": 289.8669,
                "WRT_MW": 420.2,
                "WSCRA_MW": 462.9321,
                "LRT_MW": 13407.463,
                "LSCRA_MW": 13093.4495,
                "IRT_MW": -491,
                "ISCRA_MW": 416
            },
            {
                "HR": "2024-11-13 15:30:00",
                "SRT_MW": 105,
                "SSCRA_MW": 267.5721,
                "WRT_MW": 430.3,
                "WSCRA_MW": 461.3533,
                "LRT_MW": 13464.426,
                "LSCRA_MW": 13216.0627,
                "IRT_MW": -491,
                "ISCRA_MW": 416
            },
            {
                "HR": "2024-11-13 15:35:00",
                "SRT_MW": 87.2,
                "SSCRA_MW": 245.2774,
                "WRT_MW": 421.4,
                "WSCRA_MW": 459.7746,
                "LRT_MW": 13611.039,
                "LSCRA_MW": 13338.676,
                "IRT_MW": -491,
                "ISCRA_MW": 416
            },
            {
                "HR": "2024-11-13 15:40:00",
                "SRT_MW": 70.3,
                "SSCRA_MW": 227.0209,
                "WRT_MW": 413.2,
                "WSCRA_MW": 458.3547,
                "LRT_MW": 13773.745,
                "LSCRA_MW": 13442.7526,
                "IRT_MW": -491,
                "ISCRA_MW": 416
            },
            {
                "HR": "2024-11-13 15:45:00",
                "SRT_MW": 55.4,
                "SSCRA_MW": 209.6146,
                "WRT_MW": 428.8,
                "WSCRA_MW": 456.9683,
                "LRT_MW": 13892.69,
                "LSCRA_MW": 13542.9268,
                "IRT_MW": -491,
                "ISCRA_MW": 416
            },
            {
                "HR": "2024-11-13 15:50:00",
                "SRT_MW": 42,
                "SSCRA_MW": 192.2084,
                "WRT_MW": 430.3,
                "WSCRA_MW": 455.5819,
                "LRT_MW": 14020.072,
                "LSCRA_MW": 13643.101,
                "IRT_MW": -491,
                "ISCRA_MW": 416
            },
            {
                "HR": "2024-11-13 15:55:00",
                "SRT_MW": 30.2,
                "SSCRA_MW": 174.8021,
                "WRT_MW": 421.4,
                "WSCRA_MW": 454.1955,
                "LRT_MW": 14175.47,
                "LSCRA_MW": 13743.2753,
                "IRT_MW": -491,
                "ISCRA_MW": 416
            },
            {
                "HR": "2024-11-13 16:00:00",
                "SRT_MW": 20.8,
                "SSCRA_MW": 157.3958,
                "WRT_MW": 425.9,
                "WSCRA_MW": 452.8091,
                "LRT_MW": 14298.577,
                "LSCRA_MW": 13843.4495,
                "IRT_MW": -797,
                "ISCRA_MW": 356
            },
            {
                "HR": "2024-11-13 16:05:00",
                "SRT_MW": 14.5,
                "SSCRA_MW": 139.9895,
                "WRT_MW": 406.5,
                "WSCRA_MW": 451.4226,
                "LRT_MW": 14297.475,
                "LSCRA_MW": 13943.6237,
                "IRT_MW": -797,
                "ISCRA_MW": 356
            },
            {
                "HR": "2024-11-13 16:10:00",
                "SRT_MW": 9.9,
                "SSCRA_MW": 122.5833,
                "WRT_MW": 423.9,
                "WSCRA_MW": 450.0362,
                "LRT_MW": 14370.661,
                "LSCRA_MW": 14043.7979,
                "IRT_MW": -797,
                "ISCRA_MW": 356
            },
            {
                "HR": "2024-11-13 16:15:00",
                "SRT_MW": 6.9,
                "SSCRA_MW": 105.177,
                "WRT_MW": 416.9,
                "WSCRA_MW": 448.6498,
                "LRT_MW": 14488.695,
                "LSCRA_MW": 14143.9721,
                "IRT_MW": -797,
                "ISCRA_MW": 356
            },
            {
                "HR": "2024-11-13 16:20:00",
                "SRT_MW": 4.3,
                "SSCRA_MW": 87.7707,
                "WRT_MW": 404,
                "WSCRA_MW": 447.2634,
                "LRT_MW": 14646.26,
                "LSCRA_MW": 14244.1463,
                "IRT_MW": -797,
                "ISCRA_MW": 356
            },
            {
                "HR": "2024-11-13 16:25:00",
                "SRT_MW": 2.7,
                "SSCRA_MW": 70.3645,
                "WRT_MW": 414.1,
                "WSCRA_MW": 445.877,
                "LRT_MW": 14731.715,
                "LSCRA_MW": 14344.3206,
                "IRT_MW": -797,
                "ISCRA_MW": 356
            },
            {
                "HR": "2024-11-13 16:30:00",
                "SRT_MW": 2.1,
                "SSCRA_MW": 52.9582,
                "WRT_MW": 402.8,
                "WSCRA_MW": 444.4906,
                "LRT_MW": 14853.497,
                "LSCRA_MW": 14444.4948,
                "IRT_MW": -664,
                "ISCRA_MW": 356
            },
            {
                "HR": "2024-11-13 16:35:00",
                "SRT_MW": 2,
                "SSCRA_MW": 35.5519,
                "WRT_MW": 414.7,
                "WSCRA_MW": 443.1042,
                "LRT_MW": 14951.413,
                "LSCRA_MW": 14544.669,
                "IRT_MW": -664,
                "ISCRA_MW": 356
            },
            {
                "HR": "2024-11-13 16:40:00",
                "SRT_MW": 2,
                "SSCRA_MW": 23.6202,
                "WRT_MW": 402.6,
                "WSCRA_MW": 441.9909,
                "LRT_MW": 15095.62,
                "LSCRA_MW": 14634.8084,
                "IRT_MW": -664,
                "ISCRA_MW": 356
            },
            {
                "HR": "2024-11-13 16:45:00",
                "SRT_MW": 2,
                "SSCRA_MW": 21.9533,
                "WRT_MW": 397.1,
                "WSCRA_MW": 441.3899,
                "LRT_MW": 15225.088,
                "LSCRA_MW": 14706.1324,
                "IRT_MW": -797,
                "ISCRA_MW": 356
            },
            {
                "HR": "2024-11-13 16:50:00",
                "SRT_MW": 2,
                "SSCRA_MW": 20.2864,
                "WRT_MW": 404,
                "WSCRA_MW": 440.7889,
                "LRT_MW": 15347.512,
                "LSCRA_MW": 14777.4564,
                "IRT_MW": -797,
                "ISCRA_MW": 356
            },
            {
                "HR": "2024-11-13 16:55:00",
                "SRT_MW": 2,
                "SSCRA_MW": 18.6195,
                "WRT_MW": 405.7,
                "WSCRA_MW": 440.1878,
                "LRT_MW": 15377.355,
                "LSCRA_MW": 14848.7805,
                "IRT_MW": -797,
                "ISCRA_MW": 356
            },
            {
                "HR": "2024-11-13 17:00:00",
                "SRT_MW": 2,
                "SSCRA_MW": 16.9526,
                "WRT_MW": 403.3,
                "WSCRA_MW": 439.5868,
                "LRT_MW": 15418.685,
                "LSCRA_MW": 14920.1045,
                "IRT_MW": -666,
                "ISCRA_MW": 434
            },
            {
                "HR": "2024-11-13 17:05:00",
                "SRT_MW": 2,
                "SSCRA_MW": 15.2857,
                "WRT_MW": 413.7,
                "WSCRA_MW": 438.9857,
                "LRT_MW": 15429.68,
                "LSCRA_MW": 14991.4286,
                "IRT_MW": -666,
                "ISCRA_MW": 434
            },
            {
                "HR": "2024-11-13 17:10:00",
                "SRT_MW": 2,
                "SSCRA_MW": 13.6188,
                "WRT_MW": 411,
                "WSCRA_MW": 438.3847,
                "LRT_MW": 15434.791,
                "LSCRA_MW": 15062.7526,
                "IRT_MW": -666,
                "ISCRA_MW": 434
            },
            {
                "HR": "2024-11-13 17:15:00",
                "SRT_MW": 2,
                "SSCRA_MW": 11.9519,
                "WRT_MW": 408.8,
                "WSCRA_MW": 437.7836,
                "LRT_MW": 15485.44,
                "LSCRA_MW": 15134.0767,
                "IRT_MW": -739,
                "ISCRA_MW": 434
            },
            {
                "HR": "2024-11-13 17:20:00",
                "SSCRA_MW": 10.285,
                "WSCRA_MW": 437.1826,
                "LSCRA_MW": 15205.4007,
                "ISCRA_MW": 434
            },
            {
                "HR": "2024-11-13 17:25:00",
                "SSCRA_MW": 8.6181,
                "WSCRA_MW": 436.5815,
                "LSCRA_MW": 15276.7247,
                "ISCRA_MW": 434
            },
            {
                "HR": "2024-11-13 17:30:00",
                "SSCRA_MW": 6.9512,
                "WSCRA_MW": 435.9805,
                "LSCRA_MW": 15348.0488,
                "ISCRA_MW": 434
            },
            {
                "HR": "2024-11-13 17:35:00",
                "SSCRA_MW": 5.2843,
                "WSCRA_MW": 435.3794,
                "LSCRA_MW": 15419.3728,
                "ISCRA_MW": 434
            },
            {
                "HR": "2024-11-13 17:40:00",
                "SSCRA_MW": 3.6174,
                "WSCRA_MW": 434.7784,
                "LSCRA_MW": 15490.6969,
                "ISCRA_MW": 434
            },
            {
                "HR": "2024-11-13 17:45:00",
                "SSCRA_MW": 3.3094,
                "WSCRA_MW": 435.1878,
                "LSCRA_MW": 15493.0314,
                "ISCRA_MW": 434
            },
            {
                "HR": "2024-11-13 17:50:00",
                "SSCRA_MW": 3.2052,
                "WSCRA_MW": 435.7488,
                "LSCRA_MW": 15485.0174,
                "ISCRA_MW": 434
            },
            {
                "HR": "2024-11-13 17:55:00",
                "SSCRA_MW": 3.101,
                "WSCRA_MW": 436.3098,
                "LSCRA_MW": 15477.0035,
                "ISCRA_MW": 434
            },
            {
                "HR": "2024-11-13 18:00:00",
                "SSCRA_MW": 2.9969,
                "WSCRA_MW": 436.8707,
                "LSCRA_MW": 15468.9895,
                "ISCRA_MW": 449
            },
            {
                "HR": "2024-11-13 18:05:00",
                "SSCRA_MW": 2.8927,
                "WSCRA_MW": 437.4317,
                "LSCRA_MW": 15460.9756,
                "ISCRA_MW": 449
            },
            {
                "HR": "2024-11-13 18:10:00",
                "SSCRA_MW": 2.7885,
                "WSCRA_MW": 437.9927,
                "LSCRA_MW": 15452.9617,
                "ISCRA_MW": 449
            },
            {
                "HR": "2024-11-13 18:15:00",
                "SSCRA_MW": 2.6843,
                "WSCRA_MW": 438.5537,
                "LSCRA_MW": 15444.9477,
                "ISCRA_MW": 449
            },
            {
                "HR": "2024-11-13 18:20:00",
                "SSCRA_MW": 2.5801,
                "WSCRA_MW": 439.1146,
                "LSCRA_MW": 15436.9338,
                "ISCRA_MW": 449
            },
            {
                "HR": "2024-11-13 18:25:00",
                "SSCRA_MW": 2.476,
                "WSCRA_MW": 439.6756,
                "LSCRA_MW": 15428.9199,
                "ISCRA_MW": 449
            },
            {
                "HR": "2024-11-13 18:30:00",
                "SSCRA_MW": 2.3718,
                "WSCRA_MW": 440.2366,
                "LSCRA_MW": 15420.9059,
                "ISCRA_MW": 449
            },
            {
                "HR": "2024-11-13 18:35:00",
                "SSCRA_MW": 2.2676,
                "WSCRA_MW": 440.7976,
                "LSCRA_MW": 15412.892,
                "ISCRA_MW": 449
            },
            {
                "HR": "2024-11-13 18:40:00",
                "SSCRA_MW": 2.1634,
                "WSCRA_MW": 441.3585,
                "LSCRA_MW": 15404.878,
                "ISCRA_MW": 449
            },
            {
                "HR": "2024-11-13 18:45:00",
                "SSCRA_MW": 2.0969,
                "WSCRA_MW": 441.1042,
                "LSCRA_MW": 15389.6516,
                "ISCRA_MW": 449
            },
            {
                "HR": "2024-11-13 18:50:00",
                "SSCRA_MW": 2.0889,
                "WSCRA_MW": 439.5815,
                "LSCRA_MW": 15363.2056,
                "ISCRA_MW": 449
            },
            {
                "HR": "2024-11-13 18:55:00",
                "SSCRA_MW": 2.0808,
                "WSCRA_MW": 438.0589,
                "LSCRA_MW": 15336.7596,
                "ISCRA_MW": 449
            },
            {
                "HR": "2024-11-13 19:00:00",
                "SSCRA_MW": 2.0728,
                "WSCRA_MW": 436.5362,
                "LSCRA_MW": 15310.3136,
                "ISCRA_MW": 530
            },
            {
                "HR": "2024-11-13 19:05:00",
                "SSCRA_MW": 2.0648,
                "WSCRA_MW": 435.0136,
                "LSCRA_MW": 15283.8676,
                "ISCRA_MW": 530
            },
            {
                "HR": "2024-11-13 19:10:00",
                "SSCRA_MW": 2.0568,
                "WSCRA_MW": 433.4909,
                "LSCRA_MW": 15257.4216,
                "ISCRA_MW": 530
            },
            {
                "HR": "2024-11-13 19:15:00",
                "SSCRA_MW": 2.0488,
                "WSCRA_MW": 431.9683,
                "LSCRA_MW": 15230.9756,
                "ISCRA_MW": 530
            },
            {
                "HR": "2024-11-13 19:20:00",
                "SSCRA_MW": 2.0408,
                "WSCRA_MW": 430.4456,
                "LSCRA_MW": 15204.5296,
                "ISCRA_MW": 530
            },
            {
                "HR": "2024-11-13 19:25:00",
                "SSCRA_MW": 2.0328,
                "WSCRA_MW": 428.923,
                "LSCRA_MW": 15178.0836,
                "ISCRA_MW": 530
            },
            {
                "HR": "2024-11-13 19:30:00",
                "SSCRA_MW": 2.0247,
                "WSCRA_MW": 427.4003,
                "LSCRA_MW": 15151.6376,
                "ISCRA_MW": 530
            },
            {
                "HR": "2024-11-13 19:35:00",
                "SSCRA_MW": 2.0167,
                "WSCRA_MW": 425.8777,
                "LSCRA_MW": 15125.1916,
                "ISCRA_MW": 530
            },
            {
                "HR": "2024-11-13 19:40:00",
                "SSCRA_MW": 2.0087,
                "WSCRA_MW": 424.3551,
                "LSCRA_MW": 15098.7456,
                "ISCRA_MW": 530
            },
            {
                "HR": "2024-11-13 19:45:00",
                "SSCRA_MW": 2.0007,
                "WSCRA_MW": 422.8324,
                "LSCRA_MW": 15072.2997,
                "ISCRA_MW": 530
            },
            {
                "HR": "2024-11-13 19:50:00",
                "SSCRA_MW": 2,
                "WSCRA_MW": 420.7244,
                "LSCRA_MW": 15031.2195,
                "ISCRA_MW": 530
            },
            {
                "HR": "2024-11-13 19:55:00",
                "SSCRA_MW": 2,
                "WSCRA_MW": 418.5606,
                "LSCRA_MW": 14988.7456,
                "ISCRA_MW": 530
            },
            {
                "HR": "2024-11-13 20:00:00",
                "SSCRA_MW": 2,
                "WSCRA_MW": 416.3969,
                "LSCRA_MW": 14946.2718,
                "ISCRA_MW": 619
            },
            {
                "HR": "2024-11-13 20:05:00",
                "SSCRA_MW": 2,
                "WSCRA_MW": 414.2331,
                "LSCRA_MW": 14903.7979,
                "ISCRA_MW": 619
            },
            {
                "HR": "2024-11-13 20:10:00",
                "SSCRA_MW": 2,
                "WSCRA_MW": 412.0693,
                "LSCRA_MW": 14861.324,
                "ISCRA_MW": 619
            },
            {
                "HR": "2024-11-13 20:15:00",
                "SSCRA_MW": 2,
                "WSCRA_MW": 409.9056,
                "LSCRA_MW": 14818.8502,
                "ISCRA_MW": 619
            },
            {
                "HR": "2024-11-13 20:20:00",
                "SSCRA_MW": 2,
                "WSCRA_MW": 407.7418,
                "LSCRA_MW": 14776.3763,
                "ISCRA_MW": 619
            },
            {
                "HR": "2024-11-13 20:25:00",
                "SSCRA_MW": 2,
                "WSCRA_MW": 405.578,
                "LSCRA_MW": 14733.9024,
                "ISCRA_MW": 619
            },
            {
                "HR": "2024-11-13 20:30:00",
                "SSCRA_MW": 2,
                "WSCRA_MW": 403.4143,
                "LSCRA_MW": 14691.4286,
                "ISCRA_MW": 619
            },
            {
                "HR": "2024-11-13 20:35:00",
                "SSCRA_MW": 2,
                "WSCRA_MW": 401.2505,
                "LSCRA_MW": 14648.9547,
                "ISCRA_MW": 619
            },
            {
                "HR": "2024-11-13 20:40:00",
                "SSCRA_MW": 2,
                "WSCRA_MW": 399.0868,
                "LSCRA_MW": 14606.4808,
                "ISCRA_MW": 619
            },
            {
                "HR": "2024-11-13 20:45:00",
                "SSCRA_MW": 2,
                "WSCRA_MW": 396.923,
                "LSCRA_MW": 14564.007,
                "ISCRA_MW": 619
            },
            {
                "HR": "2024-11-13 20:50:00",
                "SSCRA_MW": 2,
                "WSCRA_MW": 394.3272,
                "LSCRA_MW": 14513.8676,
                "ISCRA_MW": 619
            },
            {
                "HR": "2024-11-13 20:55:00",
                "SSCRA_MW": 2,
                "WSCRA_MW": 391.1697,
                "LSCRA_MW": 14453.7631,
                "ISCRA_MW": 619
            },
            {
                "HR": "2024-11-13 21:00:00",
                "SSCRA_MW": 2,
                "WSCRA_MW": 388.0122,
                "LSCRA_MW": 14393.6585,
                "ISCRA_MW": 611
            },
            {
                "HR": "2024-11-13 21:05:00",
                "SSCRA_MW": 2,
                "WSCRA_MW": 384.8547,
                "LSCRA_MW": 14333.554,
                "ISCRA_MW": 611
            },
            {
                "HR": "2024-11-13 21:10:00",
                "SSCRA_MW": 2,
                "WSCRA_MW": 381.6972,
                "LSCRA_MW": 14273.4495,
                "ISCRA_MW": 611
            },
            {
                "HR": "2024-11-13 21:15:00",
                "SSCRA_MW": 2,
                "WSCRA_MW": 378.5397,
                "LSCRA_MW": 14213.3449,
                "ISCRA_MW": 611
            },
            {
                "HR": "2024-11-13 21:20:00",
                "SSCRA_MW": 2,
                "WSCRA_MW": 375.3822,
                "LSCRA_MW": 14153.2404,
                "ISCRA_MW": 611
            },
            {
                "HR": "2024-11-13 21:25:00",
                "SSCRA_MW": 2,
                "WSCRA_MW": 372.2247,
                "LSCRA_MW": 14093.1359,
                "ISCRA_MW": 611
            },
            {
                "HR": "2024-11-13 21:30:00",
                "SSCRA_MW": 2,
                "WSCRA_MW": 369.0672,
                "LSCRA_MW": 14033.0314,
                "ISCRA_MW": 611
            },
            {
                "HR": "2024-11-13 21:35:00",
                "SSCRA_MW": 2,
                "WSCRA_MW": 365.9098,
                "LSCRA_MW": 13972.9268,
                "ISCRA_MW": 611
            },
            {
                "HR": "2024-11-13 21:40:00",
                "SSCRA_MW": 2,
                "WSCRA_MW": 362.7523,
                "LSCRA_MW": 13912.8223,
                "ISCRA_MW": 611
            },
            {
                "HR": "2024-11-13 21:45:00",
                "SSCRA_MW": 2,
                "WSCRA_MW": 359.5948,
                "LSCRA_MW": 13852.7178,
                "ISCRA_MW": 611
            },
            {
                "HR": "2024-11-13 21:50:00",
                "SSCRA_MW": 2,
                "WSCRA_MW": 356.4373,
                "LSCRA_MW": 13792.6132,
                "ISCRA_MW": 611
            },
            {
                "HR": "2024-11-13 21:55:00",
                "SSCRA_MW": 2,
                "WSCRA_MW": 353.8624,
                "LSCRA_MW": 13714.1115,
                "ISCRA_MW": 611
            },
            {
                "HR": "2024-11-13 22:00:00",
                "SSCRA_MW": 2,
                "WSCRA_MW": 351.3139,
                "LSCRA_MW": 13634.7735,
                "ISCRA_MW": 190
            },
            {
                "HR": "2024-11-13 22:05:00",
                "SSCRA_MW": 2,
                "WSCRA_MW": 348.7655,
                "LSCRA_MW": 13555.4355,
                "ISCRA_MW": 190
            },
            {
                "HR": "2024-11-13 22:10:00",
                "SSCRA_MW": 2,
                "WSCRA_MW": 346.2171,
                "LSCRA_MW": 13476.0976,
                "ISCRA_MW": 190
            },
            {
                "HR": "2024-11-13 22:15:00",
                "SSCRA_MW": 2,
                "WSCRA_MW": 343.6686,
                "LSCRA_MW": 13396.7596,
                "ISCRA_MW": 190
            },
            {
                "HR": "2024-11-13 22:20:00",
                "SSCRA_MW": 2,
                "WSCRA_MW": 341.1202,
                "LSCRA_MW": 13317.4216,
                "ISCRA_MW": 190
            },
            {
                "HR": "2024-11-13 22:25:00",
                "SSCRA_MW": 2,
                "WSCRA_MW": 338.5718,
                "LSCRA_MW": 13238.0836,
                "ISCRA_MW": 190
            },
            {
                "HR": "2024-11-13 22:30:00",
                "SSCRA_MW": 2,
                "WSCRA_MW": 336.0233,
                "LSCRA_MW": 13158.7456,
                "ISCRA_MW": 190
            },
            {
                "HR": "2024-11-13 22:35:00",
                "SSCRA_MW": 2,
                "WSCRA_MW": 333.4749,
                "LSCRA_MW": 13079.4077,
                "ISCRA_MW": 190
            },
            {
                "HR": "2024-11-13 22:40:00",
                "SSCRA_MW": 2,
                "WSCRA_MW": 330.9265,
                "LSCRA_MW": 13000.0697,
                "ISCRA_MW": 190
            },
            {
                "HR": "2024-11-13 22:45:00",
                "SSCRA_MW": 2,
                "WSCRA_MW": 328.378,
                "LSCRA_MW": 12920.7317,
                "ISCRA_MW": 190
            },
            {
                "HR": "2024-11-13 22:50:00",
                "SSCRA_MW": 2,
                "WSCRA_MW": 325.8296,
                "LSCRA_MW": 12841.3937,
                "ISCRA_MW": 190
            },
            {
                "HR": "2024-11-13 22:55:00",
                "SSCRA_MW": 2,
                "WSCRA_MW": 323.7258,
                "LSCRA_MW": 12767.0383,
                "ISCRA_MW": 190
            },
            {
                "HR": "2024-11-13 23:00:00",
                "SSCRA_MW": 2,
                "WSCRA_MW": 322.107,
                "LSCRA_MW": 12698.1185,
                "ISCRA_MW": 338
            },
            {
                "HR": "2024-11-13 23:05:00",
                "SSCRA_MW": 2,
                "WSCRA_MW": 320.4882,
                "LSCRA_MW": 12629.1986,
                "ISCRA_MW": 338
            },
            {
                "HR": "2024-11-13 23:10:00",
                "SSCRA_MW": 2,
                "WSCRA_MW": 318.8693,
                "LSCRA_MW": 12560.2787,
                "ISCRA_MW": 338
            },
            {
                "HR": "2024-11-13 23:15:00",
                "SSCRA_MW": 2,
                "WSCRA_MW": 317.2505,
                "LSCRA_MW": 12491.3589,
                "ISCRA_MW": 338
            },
            {
                "HR": "2024-11-13 23:20:00",
                "SSCRA_MW": 2,
                "WSCRA_MW": 315.6317,
                "LSCRA_MW": 12422.439,
                "ISCRA_MW": 338
            },
            {
                "HR": "2024-11-13 23:25:00",
                "SSCRA_MW": 2,
                "WSCRA_MW": 314.0129,
                "LSCRA_MW": 12353.5192,
                "ISCRA_MW": 338
            },
            {
                "HR": "2024-11-13 23:30:00",
                "SSCRA_MW": 2,
                "WSCRA_MW": 312.3941,
                "LSCRA_MW": 12284.5993,
                "ISCRA_MW": 338
            },
            {
                "HR": "2024-11-13 23:35:00",
                "SSCRA_MW": 2,
                "WSCRA_MW": 310.7753,
                "LSCRA_MW": 12215.6794,
                "ISCRA_MW": 338
            },
            {
                "HR": "2024-11-13 23:40:00",
                "SSCRA_MW": 2,
                "WSCRA_MW": 309.1564,
                "LSCRA_MW": 12146.7596,
                "ISCRA_MW": 338
            },
            {
                "HR": "2024-11-13 23:45:00",
                "SSCRA_MW": 2,
                "WSCRA_MW": 307.5376,
                "LSCRA_MW": 12077.8397,
                "ISCRA_MW": 338
            },
            {
                "HR": "2024-11-13 23:50:00",
                "SSCRA_MW": 2,
                "WSCRA_MW": 305.9188,
                "LSCRA_MW": 12008.9199,
                "ISCRA_MW": 338
            },
            {
                "HR": "2024-11-13 23:55:00",
                "SSCRA_MW": 2,
                "WSCRA_MW": 304.3,
                "LSCRA_MW": 11940,
                "ISCRA_MW": 338
            }
        ];

        const now = new Date();

        // Filter valid data entries
        const filteredData = fake_data.filter(item => {
            const itemTime = new Date(item.HR);
            const hasValidValues = item.SRT_MW !== undefined && item.WRT_MW !== undefined && item.LRT_MW !== undefined;
            return itemTime <= now && hasValidValues;
        });

        console.log("Filtered Data:", filteredData);

        /*
        const labels = filteredData.map(item => {
            const date = new Date(item.HR);
            const minutes = date.getMinutes();
            // Use the hour as the label only for entries on the hour
            return minutes === 0 ? date.getHours().toString().padStart(2, '0') : "";
        });
        
        Generate x-axis labels for hourly markers only
        const labels = filteredData.map(item => {
            const date = new Date(item.HR);
            return date.getMinutes() === 0
                ? date.getHours().toString().padStart(2, '0') + ":00"
                : ""; // Empty string for non-hourly data
        });
        */
        const labels = filteredData.map(item => {
            const date = new Date(item.HR);
            return date.getHours().toString().padStart(2, '0') + ":" + date.getMinutes().toString().padStart(2, '0'); // Format as HH:mm
        });

        // Calculate metrics
        const solarData = filteredData.map(item => (item.SRT_MW || 0) - (item.SSCRA_MW || 0));
        const windData = filteredData.map(item => (item.WRT_MW || 0) - (item.WSCRA_MW || 0));
        const loadData = filteredData.map(item => (item.LRT_MW || 0) - (item.LSCRA_MW || 0));
        const intData = filteredData.map(item => (-1 * (item.ISCRA_MW || 0)) - (item.IRT_MW || 0));
        const netData = filteredData.map((_, index) =>
            (solarData[index] || 0) +
            (windData[index] || 0) +
            (loadData[index] || 0) +
            ((-1 * (filteredData[index].ISCRA_MW || 0)) - (filteredData[index].IRT_MW || 0))
        );

        console.log("Metrics Calculated");

        // Update chart if it exists, otherwise create a new chart
        const ctx = document.getElementById("dynamicGraph").getContext("2d");
        if (chartInstance) {
            chartInstance.data.labels = labels;
            chartInstance.data.datasets[0].data = solarData;
            chartInstance.data.datasets[1].data = windData;
            chartInstance.data.datasets[2].data = loadData;
            chartInstance.data.datasets[3].data = intData;
            chartInstance.data.datasets[4].data = netData;
            chartInstance.update();
        } else {
            chartInstance = new Chart(ctx, {
                type: "line",
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: "Delta SCRA|Solar",
                            data: solarData,
                            borderColor: "orange",
                            fill: false,
                            pointRadius: 0
                        },
                        {
                            label: "Delta SCRA|Wind",
                            data: windData,
                            borderColor: "blue",
                            fill: false,
                            pointRadius: 0
                        },
                        {
                            label: "Delta SCRA|Load",
                            data: loadData,
                            borderColor: "green",
                            fill: false,
                            pointRadius: 0
                        },
                        {
                            label: "Delta SCRA|Int",
                            data: intData,
                            borderColor: "red",
                            fill: false,
                            pointRadius: 0
                        },
                        {
                            label: "NET",
                            data: netData,
                            borderColor: "purple",
                            borderDash: [5, 5], // Dashed line for distinction
                            fill: false,
                            pointRadius: 0
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: "top"
                        }
                    },
                    scales: {
                        x: {
                            type: 'category',

                            title: {
                                display: true,
                                text: "Time"
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: "MW"
                            }
                        }
                    }
                }
            });
        }

        // Update last update timestamp
        const currentTime = new Date().toLocaleString();
        $("#updateTimestamp").text(currentTime);

    }

    // Initial graph rendering
    fetchAndRenderGraph();

    // Refresh data and graph every 5 minutes (300000 ms)
    setInterval(fetchAndRenderGraph, 300000);
});
