import { useState } from 'react';
import Notiflix from 'notiflix';

import ErrorBoundary from './ErrorBoundary/ErrorBoundary';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from 'components/Button/Button';
import Loader from './Loader/Loader';
import Modal from './Modal/Modal';
import { getImages } from '../api/api';

const App = () => {

  let [name, setName] = useState('');
  let [page, setPage] = useState(1);
  let [items, setItems] = useState([]);
  let [isLoading, setIsLoading] = useState(false);
  let [more, setMore] = useState(false);
  let [largeUrl, setLargeUrl] = useState('');
  let [modal, setModal] = useState(false);

  const onSubmit = (ev) => {
    ev.preventDefault();
    setPage(page = 1);
    setItems(items = []);
    setMore(false);

    const form = ev.currentTarget;
    const search = form.elements.search.value;
    
    if ( search !== '') {
      setName(name = search);
      fetchImg();
    }
    form.reset();
  };

  const fetchImg = async () => {
    try {
      setIsLoading(true);
      let data = await getImages(name, page);
      let photos = data.hits;
      const imgPerPage = Math.ceil(data.totalHits / 12);

      if (data.totalHits > 12) {
        setMore(true);
      }
      if (imgPerPage === page) {
        setMore(false);
      }

      if (photos.length === 0) {
        setIsLoading(false);
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }

      setItems([...items, ...photos]);
      setIsLoading(false);

    } catch (error) {
      setIsLoading(false);
      Notiflix.Notify.failure(`Error! ${error.message}`);
    }
  };

  const handleClickMore = async () => {
    await setPage(page = page + 1);
    fetchImg();
  };

  const openModal = (id) => {
    const itemToFind = items.find(item => item.id === id);
    setModal(true);
    setLargeUrl(itemToFind.largeImageURL);
  };

  const closeModal = () => {
    setModal(false);
  };

    return (
      <>
        <ErrorBoundary>
          <Searchbar onSubmit={onSubmit} />
          <ImageGallery items={items} openModal={openModal}/>
          {more && <Button onClick={handleClickMore} />}
          {isLoading && <Loader />}
          {modal && <Modal largeUrl={largeUrl} closeModal={closeModal}/>}
        </ErrorBoundary>
      </>
    );

};

export default App;