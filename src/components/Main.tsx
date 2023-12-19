import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import { MainImg } from './Common/Reference';
import { ButtonStyle } from '../styles/styled';
import * as M from '../styles/Main.styles';
import Link from 'next/link';

const Main = () => {
  const serviceRef = useRef<HTMLDivElement>(null);
  const whatIsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    const elements = document.querySelectorAll('.hidden');
    elements.forEach(el => observer.observe(el));

    return () => elements.forEach(el => observer.unobserve(el));
  }, []);

  const handleScroll = () => {
    [serviceRef, whatIsRef].forEach(ref => {
      const top = ref.current?.getBoundingClientRect().top ?? 0;
      const windowHeight = window.innerHeight;
      if (top >= 0 && top <= windowHeight / 2) {
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    })
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <>
      <M.MainWrap>
        <M.MainLeft>
          <h1>Canvas</h1>
          <p>
            Canvas is an Internet Computer-based virtual exhibition platform. Artists can exhibit their works in a virtual space and users can purchase and collect their works.
          </p>
          <M.MainBtnWrap>
            <Link href="/explore"><ButtonStyle>Get Start</ButtonStyle></Link>
          </M.MainBtnWrap>
        </M.MainLeft>
        <M.ImageContainer>
          <Image src={MainImg} alt='main' layout='responsive' width={800} height={720} quality={100} />
        </M.ImageContainer>
      </M.MainWrap>
    </>
  )
}


export default Main;