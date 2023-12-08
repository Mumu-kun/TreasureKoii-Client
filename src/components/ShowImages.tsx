// show images for puzzles, hunts(after hunt images) etc.

import React, { useEffect, useState } from "react";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
import { RxDotFilled } from "react-icons/rx";
import axios from "../utils/axios/AxiosSetup";
import { Image } from "../types";
import Loading from "../utils/Loading";

const ShowImages: React.FC<{ url: string | null }> = ({ url }) => {
	const [images, setImages] = useState<Image[]>([]);
	const [imageLoaded, setImageLoaded] = useState<boolean>(false);
	useEffect(() => {
		const fetchImages = async () => {
			try {
				const response = await axios.get(`${url}`);
				setImages(response.data);
				setImageLoaded(true);
				console.log(response);
			} catch (error) {
				console.log(error);
				setImageLoaded(true);
			}
		};

		if (url) {
			fetchImages();
		}
	}, [url]);

	const [currentIndex, setCurrentIndex] = useState<number>(0);

	const prevImage = () => {
		if (currentIndex === 0) {
			setCurrentIndex(images.length - 1);
		} else {
			setCurrentIndex(currentIndex - 1);
		}
	};
	const nextImage = () => {
		if (currentIndex === images.length - 1) {
			setCurrentIndex(0);
		} else {
			setCurrentIndex(currentIndex + 1);
		}
	};

	const autoSlide = () => {
		if (currentIndex === images.length - 1) {
			setCurrentIndex(0);
		} else {
			setCurrentIndex(currentIndex + 1);
		}
	};

	useEffect(() => {
		const interval = setInterval(() => {
			if (images.length > 1) {
				autoSlide();
			}
		}, 10000);
		return () => clearInterval(interval);
	}, [currentIndex]);

	return (
		<div>
			{!imageLoaded && <Loading />}
			{images.length !== 0 && (
				<div className="max-w-[400px] sm:max-w-[500px] xl:max-w-[600px] h-[400px] sm:h-[500px] xl:h-[600px] w-full m-auto py-8 px-4 relative group">
					<div
						style={{
							backgroundImage: `url(${`https://api.treasurekoii.com${images[currentIndex].image}`})`,
						}}
						className="w-full h-full rounded-md bg-center bg-cover duration-500 object-cover"
					></div>
					<div>
						<BsChevronCompactLeft
							onClick={prevImage}
							size={30}
							className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer"
						/>
					</div>
					<div>
						<BsChevronCompactRight
							onClick={nextImage}
							size={30}
							className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer"
						/>
					</div>
					<div className="flex top-4 py-2 justify-center">
						{images.map((image, index) => (
							<div key={index} className="2xl cursor-pointer">
								<RxDotFilled onClick={() => setCurrentIndex(index)} />
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default ShowImages;
