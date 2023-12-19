import React, { useContext, useEffect, useState } from 'react'
import { Artwork, Exhibition } from '../types';
import * as T from '../styles/Ticket.styles';
import Image from 'next/image';
import { DefaultImg } from './Common/Reference';
import { CanisterContext } from '../context/canister';
import Swal from 'sweetalert2';
import { canisterId as backendCanisterId } from '../declarations/backend';
import { Principal } from '@dfinity/principal';

const ExhibitionDetail = ({ exhibition }: { exhibition: Exhibition }) => {
    const { isAuthenticated, backendActor, ledgerActor } = useContext(CanisterContext);

    const [hasTicket, setHasTicket] = useState<boolean>(false);
    const [artworks, setArtworks] = useState<Artwork[]>([]);

    const blob = new Blob([new Uint8Array(exhibition.ticket.image)]);
    const url = URL.createObjectURL(blob);

    useEffect(() => {
        if (!isAuthenticated) return;
        if (!backendActor) return;

        backendActor.hasTicket(exhibition.id).then((result) => {
            console.log(result);
            setHasTicket(result);
        });

    }, [isAuthenticated, backendActor]);

    const handlePurchaseTicket = async () => {
        if (!isAuthenticated) return;
        if (!backendActor) return;
        if (!ledgerActor) return;

        Swal.fire({
            title: 'Are you sure?',
            text: "You will buy a ticket for this exhibition.",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Please wait...",
                    icon: "info",
                    didOpen: () => {
                        Swal.showLoading();

                        const buyTicket = async () => {
                            const approved = await ledgerActor.icrc2_approve({
                                fee: [],
                                memo: [],
                                from_subaccount: [],
                                created_at_time: [],
                                amount: exhibition.ticket.price,
                                expected_allowance: [],
                                expires_at: [],
                                spender: {
                                    owner: Principal.fromText(backendCanisterId),
                                    subaccount: [],
                                },
                            })

                            console.log("approved", approved);

                            const result = await backendActor.buyTicket(exhibition.id);
                            if (!result) throw new Error("Something went wrong." + result);

                            return result;
                        }

                        buyTicket().then((result) => {
                            console.log("result", result);
                            Swal.fire({
                                title: 'Success!',
                                text: "You have successfully bought a ticket.",
                                icon: 'success',
                            })
                        }).catch((error) => {
                            console.log(error);
                            Swal.fire({
                                title: 'Error!',
                                text: "Something went wrong.",
                                icon: 'error',
                            })
                        });
                    }
                });
            }
        })
    }

    useEffect(() => {
        if (!hasTicket) return;
        if (!isAuthenticated) return;
        if (!backendActor) return;

        backendActor.getArtworks(exhibition.id).then((result) => {
            setArtworks(result);
        });
    }, [hasTicket]);

    const handleBuyArtwork = async () => {
        if (!isAuthenticated) return;
        if (!backendActor) return;
        if (!ledgerActor) return;

        Swal.fire({
            title: 'Are you sure?',
            text: "You will buy this artwork.",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Please wait...",
                    icon: "info",
                    didOpen: () => {
                        Swal.showLoading();

                        const buyArtwork = async () => {
                            const approved = await ledgerActor.icrc2_approve({
                                fee: [],
                                memo: [],
                                from_subaccount: [],
                                created_at_time: [],
                                amount: artworks[0].price,
                                expected_allowance: [],
                                expires_at: [],
                                spender: {
                                    owner: Principal.fromText(backendCanisterId),
                                    subaccount: [],
                                },
                            })

                            console.log("approved", approved);

                            const result = await backendActor.buyArtwork(exhibition.id, artworks[0].id);
                            if (!result) throw new Error("Something went wrong." + result);

                            return result;
                        }

                        buyArtwork().then((result) => {
                            console.log("result", result);
                            Swal.fire({
                                title: 'Success!',
                                text: "You have successfully bought a artwork.",
                                icon: 'success',
                            })
                        }).catch((error) => {
                            console.log(error);
                            Swal.fire({
                                title: 'Error!',
                                text: "Something went wrong.",
                                icon: 'error',
                            })
                        });
                    }
                });
            }
        })
    }

    const ArtworkModal = () => {
        const blob = new Blob([new Uint8Array(artworks[0].image)]);
        const url = URL.createObjectURL(blob);

        return (
            <>
                <T.ModalImageContainer>
                    <Image src={url || DefaultImg} alt="artwork" fill={true} quality={100} />
                </T.ModalImageContainer>
                <T.ModalRight>
                    <div>
                        <h1>{artworks[0].name}</h1>
                        <p>{artworks[0].description}</p>
                    </div>
                    <div>
                        <p>Owner: {artworks[0].owner ? `${artworks[0].owner.toText().slice(0, 5)}...${artworks[0].owner.toText().slice(-5)}` : "None"}</p>
                        <p>On Sale: {artworks[0].onSale ? "Yes" : "No"}</p>
                        <p>Token Price: {artworks[0].price.toString()} Tokens</p>
                    </div>
                    <T.TicketBtn disabled={!isAuthenticated} onClick={handleBuyArtwork}>Buy Artwork</T.TicketBtn>
                </T.ModalRight>
            </>
        )
    }

    return (
        <>
            {!hasTicket ? (
                <T.Content>
                    <T.ModalImageContainer>
                        <Image src={url || DefaultImg} alt="ticket" fill={true} quality={100} />
                    </T.ModalImageContainer>
                    <T.ModalRight>
                        <div>
                            <h1>{exhibition.name}</h1>
                            <p>{exhibition.description}</p>
                        </div>
                        <div>
                            <p>Holder: {`${exhibition.owner.toText().slice(0, 5)}...${exhibition.owner.toText().slice(-5)}`}</p>
                            <p>On Exhibit: {exhibition.onExhibition ? "Yes" : "No"}</p>
                            <p>Token Price: {exhibition.ticket.price.toString()} Tokens</p>
                        </div>
                        <T.TicketBtn disabled={!isAuthenticated} onClick={handlePurchaseTicket}>Buy Ticket</T.TicketBtn>
                    </T.ModalRight>
                </T.Content>
            ) : (
                <T.Content>
                    {
                        artworks[0] ? (
                            <ArtworkModal />
                        ) : "No artworks found."
                    }
                </T.Content>

            )}
        </>
    )
}

export default ExhibitionDetail