import { useState, useCallback, useMemo, useContext } from 'react';
import { useRouter } from 'next/router';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { useTheme } from 'next-themes';

import { Button, Input } from '../components';
import images from '../assets';
import { NFTContext } from '../context/NFTContext';

const CreateNFT = () => {
  const { uploadToIPFS } = useContext(NFTContext);
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, setFormInput] = useState({ price: '', name: '', description: '' });
  const { theme } = useTheme();

  const onDrop = useCallback(async (acceptedFiles) => {
    const url = await uploadToIPFS(acceptedFiles[0]);
    setFileUrl(url);
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: 'image/*',
    maxSize: 5000000,
  });

  const fileStyle = useMemo(() => (`dark:bg-nft-black-1 bg-white border dark:border-white border-nft-gray-2 flex flex-col items-center p-5 rounded-sm border-dashed${isDragActive ? ' border-file-active' : ''}${isDragAccept ? ' border-file-accept' : ''}${isDragReject ? ' border-file-reject' : ''}`), [isDragActive, isDragAccept, isDragReject]);

  return (
    <div className="flex justify-center sm:p-4 p-12">
      <div className="w-3/5 md:w-full">
        <h1 className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold ml-4 xs:ml-0">Create new NFT</h1>
        <div className="mt-16">
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">Upload File</p>
          <div className="mt-4">
            <div {...getRootProps()} className={fileStyle}>
              <input {...getInputProps()} />
              <div className="flexCenter flex-col text-center">
                <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">JPG, PNG, GIF, SVG, WEBM. Max 100mb.</p>
                <div className="my-12 w-full flex justify-center">
                  <Image
                    src={images.upload}
                    width={100}
                    height={100}
                    objectFit="contain"
                    alt="file-upload"
                    className={(theme === 'light') ? 'filter invert' : ''}
                  />
                </div>
                <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm">Drag and Drop File</p>
                <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm mt-2">or browse media on your device</p>
              </div>
            </div>
            { fileUrl && (
            <aside>
              <div>
                <img src={fileUrl} alt="asset_file" />
              </div>
            </aside>
            ) }
          </div>
        </div>
        <Input inputType="input" title="Name" placeholder="NFT Name" handleClick={(event) => setFormInput((current) => ({ ...current, name: event.target.value }))} />
        <Input inputType="textarea" title="Description" placeholder="Description of your NFT" handleClick={(event) => setFormInput((current) => ({ ...current, description: event.target.value }))} />
        <Input inputType="number" title="Price" placeholder="Enter Price" handleClick={(event) => setFormInput((current) => ({ ...current, price: event.target.value }))} />
        <div className="mt-7 w-full flex justify-end">
          <Button btnName="Create NFT" classStyles="rounded-lg" handleClick={() => {}} />
        </div>
      </div>
    </div>
  );
};

export default CreateNFT;
