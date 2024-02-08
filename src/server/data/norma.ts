export interface NormaValidation {
	value: number;
	label: string;
	operator: string;
}
export interface NormaType {
	id: string;
	label: string;
	panker: NormaValidation[];
	janker: NormaValidation[];
	tianker: NormaValidation[];
	hanker: NormaValidation[];
}

export const TiankerLabel: NormaValidation[] = [
	{
		label: "Kurang Teliti",
		operator: ">=",
		value: 8,
	},

	{
		label: "Memiliki Konsentrasi yang Tinggi",
		operator: ">=",
		value: 0,
	},
];
export const JankerLabel: NormaValidation[] = [
	{
		label: "Emosi Tidak Stabil",
		operator: ">=",
		value: 8,
	},

	{
		label: "Emosi Stabil",
		operator: ">=",
		value: 0,
	},
];
export const DataNorma: NormaType[] = [
	{
		id: "1",
		label: "SMA IPA",
		panker: [
			{
				value: 15.599,
				label: "Baik Sekali",
				operator: ">=",
			},
			{
				value: 12.848,
				label: "Baik",
				operator: ">=",
			},
			{
				value: 10.368,
				label: "Cukup",
				operator: ">=",
			},
			{
				value: 8.258,
				label: "Kurang",
				operator: ">=",
			},
			{
				value: 8.257,
				label: "Kurang Sekali",
				operator: "<=",
			},
		],
		janker: [
			{
				value: 15,
				label: "Kurang Sekali",
				operator: ">=",
			},
			{
				value: 11,
				label: "Kurang",
				operator: ">=",
			},
			{
				value: 8,
				label: "Cukup",
				operator: ">=",
			},
			{
				value: 4,
				label: "Baik",
				operator: ">=",
			},
			{
				value: 0,
				label: "Baik Sekali",
				operator: ">=",
			},
		],
		tianker: [
			{
				value: 25,
				label: "Kurang Sekali",
				operator: ">=",
			},
			{
				value: 15,
				label: "Kurang",
				operator: ">=",
			},
			{
				value: 10,
				label: "Cukup",
				operator: ">=",
			},
			{
				value: 5,
				label: "Baik",
				operator: ">=",
			},
			{
				value: 0,
				label: "Baik Sekali",
				operator: ">=",
			},
		],
		hanker: [
			{
				value: 6.285,
				label: "Baik Sekali",
				operator: ">=",
			},
			{
				value: 3.492,
				label: "Baik",
				operator: ">=",
			},
			{
				value: 0.699,
				label: "Cukup",
				operator: ">=",
			},
			{
				value: 0.698,
				label: "Kurang",
				operator: "<=",
			},
			{
				value: -2,
				label: "Kurang Sekali",
				operator: "<=",
			},
		],
	},

	{
		id: "2",
		label: "SMA IPS",
		panker: [
			{
				value: 15.599,
				label: "Baik Sekali",
				operator: ">=",
			},
			{
				value: 12.848,
				label: "Baik",
				operator: ">=",
			},
			{
				value: 10.368,
				label: "Cukup",
				operator: ">=",
			},
			{
				value: 8.258,
				label: "Kurang",
				operator: ">=",
			},
			{
				value: 8.257,
				label: "Kurang Sekali",
				operator: "<=",
			},
		],
		janker: [
			{
				value: 15,
				label: "Kurang Sekali",
				operator: ">=",
			},
			{
				value: 11,
				label: "Kurang",
				operator: ">=",
			},
			{
				value: 8,
				label: "Cukup",
				operator: ">=",
			},
			{
				value: 4,
				label: "Baik",
				operator: ">=",
			},
			{
				value: 0,
				label: "Baik Sekali",
				operator: ">=",
			},
		],
		tianker: [
			{
				value: 23,
				label: "Kurang Sekali",
				operator: ">=",
			},
			{
				value: 13,
				label: "Kurang",
				operator: ">=",
			},
			{
				value: 8,
				label: "Cukup",
				operator: ">=",
			},
			{
				value: 3,
				label: "Baik",
				operator: ">=",
			},
			{
				value: 0,
				label: "Baik Sekali",
				operator: ">=",
			},
		],
		hanker: [
			{
				value: 6.285,
				label: "Baik Sekali",
				operator: ">=",
			},
			{
				value: 3.492,
				label: "Baik",
				operator: ">=",
			},
			{
				value: 0.699,
				label: "Cukup",
				operator: ">=",
			},
			{
				value: 0.698,
				label: "Kurang",
				operator: "<=",
			},
			{
				value: -2,
				label: "Kurang Sekali",
				operator: "<=",
			},
		],
	},
	{
		id: "3",
		label: "S1 IPA",
		panker: [
			{
				value: 17.209,
				label: "Baik Sekali",
				operator: ">=",
			},
			{
				value: 14.973,
				label: "Baik",
				operator: ">=",
			},
			{
				value: 12.736,
				label: "Cukup",
				operator: ">=",
			},
			{
				value: 10.5,
				label: "Kurang",
				operator: ">=",
			},
			{
				value: 10,
				label: "Kurang Sekali",
				operator: "<=",
			},
		],
		janker: [
			{
				value: 13,
				label: "Kurang Sekali",
				operator: ">=",
			},
			{
				value: 11,
				label: "Kurang",
				operator: ">=",
			},
			{
				value: 7,
				label: "Cukup",
				operator: ">=",
			},
			{
				value: 4,
				label: "Baik",
				operator: ">=",
			},
			{
				value: 0,
				label: "Baik Sekali",
				operator: ">=",
			},
		],
		tianker: [
			{
				value: 23,
				label: "Kurang Sekali",
				operator: ">=",
			},
			{
				value: 14,
				label: "Kurang",
				operator: ">=",
			},
			{
				value: 3,
				label: "Cukup",
				operator: ">=",
			},
			{
				value: 1,
				label: "Baik",
				operator: ">=",
			},
			{
				value: 0,
				label: "Baik Sekali",
				operator: ">=",
			},
		],
		hanker: [
			{
				value: 2.497,
				label: "Baik Sekali",
				operator: ">=",
			},
			{
				value: 1.015,
				label: "Baik",
				operator: ">=",
			},
			{
				value: 1.014,
				label: "Cukup",
				operator: "<=",
			},
			{
				value: 0.496,
				label: "Kurang",
				operator: "<=",
			},
			{
				value: -1,
				label: "Kurang Sekali",
				operator: "<=",
			},
		],
	},
	{
		id: "4",
		label: "S1 IPS",
		panker: [
			{
				value: 16.764,
				label: "Baik Sekali",
				operator: ">=",
			},
			{
				value: 14.362,
				label: "Baik",
				operator: ">=",
			},
			{
				value: 11.977,
				label: "Cukup",
				operator: ">=",
			},
			{
				value: 9.593,
				label: "Kurang",
				operator: ">=",
			},
			{
				value: 9.592,
				label: "Kurang Sekali",
				operator: "<=",
			},
		],
		janker: [
			{
				value: 15,
				label: "Kurang Sekali",
				operator: ">=",
			},
			{
				value: 11,
				label: "Kurang",
				operator: ">=",
			},
			{
				value: 5,
				label: "Cukup",
				operator: ">=",
			},
			{
				value: 2,
				label: "Baik",
				operator: ">=",
			},
			{
				value: 0,
				label: "Baik Sekali",
				operator: ">=",
			},
		],
		tianker: [
			{
				value: 23,
				label: "Kurang Sekali",
				operator: ">=",
			},
			{
				value: 14,
				label: "Kurang",
				operator: ">=",
			},
			{
				value: 3,
				label: "Cukup",
				operator: ">=",
			},
			{
				value: 1,
				label: "Baik",
				operator: ">=",
			},
			{
				value: 0,
				label: "Baik Sekali",
				operator: ">=",
			},
		],
		hanker: [
			{
				value: 2.497,
				label: "Baik Sekali",
				operator: ">=",
			},
			{
				value: 1.015,
				label: "Baik",
				operator: ">=",
			},
			{
				value: 1.014,
				label: "Cukup",
				operator: "<=",
			},
			{
				value: 0.496,
				label: "Kurang",
				operator: "<=",
			},
			{
				value: -1,
				label: "Kurang Sekali",
				operator: "<=",
			},
		],
	},
];
