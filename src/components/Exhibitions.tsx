import React, { useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import { ModalPortal, DefaultImg } from './Common/Reference';
import { Title } from '../styles/styled';
import * as T from '../styles/Ticket.styles';
import { useRouter } from 'next/router';
import { CanisterContext } from '../context/canister';
import ExhibitionDetail from './Exhibition';
import { Exhibition } from '../types';

const Exhibitions = () => {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [selectedItem, setSelectedItem] = useState<Exhibition | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { backendActor } = useContext(CanisterContext);

  const openModal = (data: Exhibition) => {
    setSelectedItem(data);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  }
  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "unset";
    setTimeout(() => {
      // setSelectedItem(null);
    }, 300); // 300ms는 애니메이션 지속 시간과 일치시킵니다.
  }

  useEffect(() => {
    if (!backendActor) return;

    backendActor.getExhibitions().then((exhibitions) => {
      console.log(exhibitions);
      setExhibitions(exhibitions);
    }).catch((err) => {
      console.log(err);
    });
  }, [backendActor]);

  return (
    <T.TicketContainer>
      <Title>
        <h1>Exhibitions</h1>
      </Title>
      <T.CardContainer>
        {
          (exhibitions.map((exhibition) => {
            const blob = new Blob([new Uint8Array(exhibition.ticket.image)]);
            const url = URL.createObjectURL(blob);

            return (
              <T.Card key={exhibition.id} onClick={() => openModal(exhibition)}>
                <T.CardImgContainer>
                  <Image src={url || DefaultImg} alt="poster" fill quality={100} />
                </T.CardImgContainer>
                <T.CardContent>
                  <h2>{exhibition.name}</h2>
                  <p className="place">{exhibition.description}</p>
                  <p>{`${exhibition.ticket.price.toString()} Token(s)`}</p>
                </T.CardContent>
              </T.Card>
            )
          }))
        }
      </T.CardContainer>
      {/* Modal */}
      {selectedItem && (
        <ModalPortal isOpen={isModalOpen} onClose={closeModal}>
          <ExhibitionDetail exhibition={selectedItem} />
        </ModalPortal>
      )}
    </T.TicketContainer>
  )
}

export default Exhibitions;
