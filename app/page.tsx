import Hero from '@/components/home/Hero';
import Ticker from '@/components/home/Ticker';
import Categories from '@/components/home/Categories';
import Bestsellers from '@/components/home/Bestsellers';
import Promise from '@/components/home/Promise';
import ShopTheRoom from '@/components/home/ShopTheRoom';
import Editorial from '@/components/home/Editorial';
import SetBuilder from '@/components/home/SetBuilder';
import Compare from '@/components/home/Compare';
import QuizTeaser from '@/components/home/QuizTeaser';
import Reviews from '@/components/home/Reviews';
import Gallery from '@/components/home/Gallery';
import Press from '@/components/home/Press';
import Boot from '@/components/theme/Boot';
import SiteJsonLd from '@/components/seo/SiteJsonLd';
import HomeBehaviors from '@/components/home/HomeBehaviors';

export default function Home() {
  return (
    <>
      <Hero />
      <Ticker />
      <Categories />
      <Bestsellers />
      <Promise />
      <ShopTheRoom />
      <Editorial />
      <SetBuilder />
      <Compare />
      <QuizTeaser />
      <Reviews />
      <Gallery />
      <Press />
      <HomeBehaviors />
      <SiteJsonLd />
      <Boot />
    </>
  );
}
