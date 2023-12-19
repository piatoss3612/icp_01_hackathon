import React, { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import * as C from '../styles/CreateTicket.styles';
import * as S from '../styles/styled';
import { CanisterContext } from '../context/canister';
import { Principal } from '@dfinity/principal';
import { canisterId as backendCanisterId } from '../declarations/backend';

const EXTENSIONS = [
  { type: 'gif' },
  { type: 'jpg' },
  { type: 'jpeg' },
  { type: 'png' },
  { type: 'mp4' },
];

const CreateExhibition = () => {
  const [ticketFile, setBannerFile] = useState<Uint8Array | null>(null);
  const [ticketFileUrl, setBannerFileUrl] = useState<string>("");

  const [artworkFile, setArtworkFile] = useState<Uint8Array | null>(null);
  const [artworkFileUrl, setArtworkFileUrl] = useState<string>("");

  const { isAuthenticated, backendActor, ledgerActor } = useContext(CanisterContext);

  const router = useRouter();

  const fileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const FILE = e.target.files[0];
    const SIZE = 100;
    const TYPE = (FILE.type).split('/')[1];
    const FSIZE = (FILE.size) / Math.pow(10, 6);
    const inputId = e.target.id;

    if (FSIZE < SIZE && EXTENSIONS.some(extension => extension.type === TYPE)) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(FILE);

      reader.onloadend = (e) => {
        const arrayBuffer = e.target?.result;
        if (arrayBuffer) {
          const uint8Array = new Uint8Array(arrayBuffer as ArrayBuffer);
          const objectURL = URL.createObjectURL(new Blob([uint8Array]));

          if (inputId === 'ticket-image') {
            setBannerFile(uint8Array);
            setBannerFileUrl(objectURL);
          } else if (inputId === 'artwork-image') {
            setArtworkFile(uint8Array);
            setArtworkFileUrl(objectURL);
          }
        }
      };
    } else {
      Swal.fire({
        title: 'Error',
        text: `File size should be less than ${SIZE}MB and file type should be ${EXTENSIONS.map(extension => extension.type).join(', ')}`,
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isAuthenticated || !backendActor || !ledgerActor) {
      return;
    }

    const exhibition = {
      name: (document.getElementById('exhibition-name') as HTMLInputElement).value,
      description: (document.getElementById('exhibition-desc') as HTMLInputElement).value,
      artworks: [
        {
          name: (document.getElementById('artwork-name') as HTMLInputElement).value,
          description: (document.getElementById('artwork-desc') as HTMLInputElement).value,
          image: artworkFile!,
          price: BigInt((document.getElementById('artwork-price') as HTMLInputElement).value),
          onSale: true,
        }
      ],
      ticketImage: ticketFile,
      ticketPrice: BigInt((document.getElementById('ticket-price') as HTMLInputElement).value),
    };

    console.log(exhibition);

    Swal.fire({
      title: "Create Exhibition requires 10 Tokens",
      text: "Are you sure you want to create this exhibition?",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Create",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Please wait...",
          icon: "info",
          didOpen: () => {
            Swal.showLoading();

            const createExhibition = async () => {
              const approved = await ledgerActor.icrc2_approve({
                fee: [],
                memo: [],
                from_subaccount: [],
                created_at_time: [],
                amount: 10n,
                expected_allowance: [],
                expires_at: [],
                spender: {
                  owner: Principal.fromText(backendCanisterId),
                  subaccount: [],
                },
              })

              const exhibitionId = await backendActor.createExhibition({
                name: exhibition.name,
                description: exhibition.description,
                artworks: exhibition.artworks,
                ticketImage: exhibition.ticketImage!,
                ticketPrice: exhibition.ticketPrice,
              });

              return exhibitionId;
            }

            createExhibition().then((exhibitionId) => {
              Swal.fire({
                title: "Success",
                text: `Exhibition created successfully with id ${exhibitionId}`,
                icon: "success",
                confirmButtonText: "OK",
              }).then(() => {
                router.push(`/explore`);
              });
            }).catch((error) => {
              Swal.fire({
                title: "Error",
                text: error.message,
                icon: "error",
                confirmButtonText: "OK",
              });
            });
          }
        });
      }
    });
  };

  return (
    <>
      <C.FormContainer onSubmit={handleSubmit}>
        <C.ImageInputContainer>
          <C.CreateImageContainer htmlFor='ticket-image'>
            <div>
              {ticketFileUrl ? (
                <Image src={ticketFileUrl} alt='Ticket Image Preview' layout='responsive' width={100} height={100} quality={100} />
              ) : (
                <FontAwesomeIcon icon={faImage} />
              )}
              <input id='ticket-image' type='file' accept='image/*' onChange={fileUpload} hidden required />
            </div>
          </C.CreateImageContainer>
        </C.ImageInputContainer>
        <C.InputWrap>
          <C.InputContainer>
            <div>
              <label htmlFor='exhibition-name'>Exhibition Name <span>*</span></label>
              <input type='text' placeholder='Exhibition Name' id='exhibition-name' required />
            </div>
          </C.InputContainer>
          <C.TextContainer>
            <label htmlFor='exhibition-desc'>Description <span>*</span></label>
            <textarea placeholder='Description' id='exhibition-desc' required />
          </C.TextContainer>
          <C.InputContainer>
            <div>
              <label htmlFor='ticket-price'>Ticket Price <span>*</span></label>
              <input type='number' placeholder='Ticket Price' id='ticket-price' step={1} required min={1} />
            </div>
          </C.InputContainer>
        </C.InputWrap>

        <hr />
        <C.ImageInputContainer>
          <C.CreateImageContainer htmlFor='artwork-image'>
            <div>
              {artworkFileUrl ? (
                <Image src={artworkFileUrl} alt='Artwork Image Preview' layout='responsive' width={100} height={100} quality={100} />
              ) : (
                <FontAwesomeIcon icon={faImage} />
              )}
              <input id='artwork-image' type='file' accept='image/*' onChange={fileUpload} hidden required />
            </div>
          </C.CreateImageContainer>
        </C.ImageInputContainer>
        <C.InputWrap>
          <C.InputContainer>
            <div>
              <label htmlFor='artwork-name'>Artwork Name <span>*</span></label>
              <input type='text' placeholder='Artwork Name' id='artwork-name' required />
            </div>
          </C.InputContainer>
          <C.TextContainer>
            <label htmlFor='artwork-desc'>Description <span>*</span></label>
            <textarea placeholder='Description' id='artwork-desc' required />
          </C.TextContainer>
          <C.InputContainer>
            <div>
              <label htmlFor='artwork-price'>Artwork Price <span>*</span></label>
              <input type='number' placeholder='Artwork Price' id='artwork-price' step={1} required min={1} />
            </div>
          </C.InputContainer>
        </C.InputWrap>
        <S.ButtonStyle type='submit'>Create</S.ButtonStyle>
      </C.FormContainer>
    </>
  )
}

export default CreateExhibition;

