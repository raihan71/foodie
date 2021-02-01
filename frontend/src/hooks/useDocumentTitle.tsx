import { useLayoutEffect } from 'react';

const useDocumentTitle = (title: string) => {
	useLayoutEffect(() => {
		if (title) {
			document.title = title;
		} else {
			document.title = 'Codevcast Network | Social network platform for devs';
		}
	}, [title]);
};

export default useDocumentTitle;
