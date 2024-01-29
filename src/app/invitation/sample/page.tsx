"use client";
import React, { useState, useEffect } from "react";

interface MatrixItem {
	x: number;
	y: number;
	value: number;
}

interface MatrixDisplayProps {
	matrix: MatrixItem[];
}

const MatrixDisplay: React.FC<MatrixDisplayProps> = ({ matrix }) => {
	// State untuk menyimpan dua nilai terkiri dan dua nilai terbawah
	const [bottomLeftValues, setBottomLeftValues] = useState<number[]>([]);

	// Fungsi untuk mendapatkan dua nilai terbawah dari kiri
	const getBottomLeftValues = () => {
		const bottomLeftValues = matrix.slice(0, 2).map((item) => item.value);

		setBottomLeftValues(bottomLeftValues);
	};

	useEffect(() => {
		getBottomLeftValues();
	}, [matrix]);

	return (
		<div>
			<h2>Dua Nilai Terbawah dari Kiri:</h2>
			<ul>
				{bottomLeftValues.map((value, index) => (
					<li key={index}>{value}</li>
				))}
			</ul>
		</div>
	);
};

const App: React.FC = () => {
	// Matriks objek
	const matrixArray: MatrixItem[] = [
		{ x: 1, y: 1, value: 1 },
		{ x: 1, y: 2, value: 2 },
		{ x: 1, y: 3, value: 3 },
		{ x: 2, y: 1, value: 4 },
		{ x: 2, y: 2, value: 5 },
		{ x: 2, y: 3, value: 6 },
		{ x: 3, y: 1, value: 7 },
		{ x: 3, y: 2, value: 8 },
		{ x: 3, y: 3, value: 9 },
	];

	return (
		<div>
			<h1>Matrix Display</h1>
			<MatrixDisplay matrix={matrixArray} />
		</div>
	);
};

export default App;
