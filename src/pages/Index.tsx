import { useEffect, useState, useRef } from 'react'
import { HeroSection } from '@/components/HeroSection'
import { PresentationSection } from '@/components/PresentationSection'
import { BadgeSection } from '@/components/BadgeSection'
import { GiftsSection } from '@/components/GiftsSection'
import { SpeakersSection } from '@/components/SpeakersSection'
import { JourneySection } from '@/components/JourneySection'
import { EventInfoSection } from '@/components/EventInfoSection'
import { FaqSection } from '@/components/FaqSection'
import { RegistrationSection } from '@/components/RegistrationSection'
import { FloatingCta } from '@/components/FloatingCta'
import { ScrollProgressBar } from '@/components/ScrollProgressBar'

export default function Index() {
  const [isFinalCtaVisible, setIsFinalCtaVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const registrationRef = useRef<HTMLDivElement>(null)

  // Check screen size for mobile floating CTA and scroll progress bar rules
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1024)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // IntersectionObserver: hide floating CTA when registration section is visible
  useEffect(() => {
    const target = registrationRef.current
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFinalCtaVisible(entry.isIntersecting)
      },
      {
        threshold: 0.15,
      },
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [])

  const scrollToRegistration = () => {
    const el = document.getElementById('inscricao')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const scrollToPresentation = () => {
    const el = document.getElementById('apresentacao')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Floating CTA should be visible on mobile only, when final CTA is NOT visible
  const showFloatingCta = isMobile && !isFinalCtaVisible

  // Spec: "Hide scroll progress bar on mobile when the floating CTA button is visible."
  const hideProgressBar = isMobile && showFloatingCta

  return (
    <div className="relative w-full">
      {/* Top Scroll Progress Bar */}
      <ScrollProgressBar hide={hideProgressBar} />

      {/* 1. HERO SECTION */}
      <HeroSection onRegisterClick={scrollToRegistration} onExploreClick={scrollToPresentation} />

      {/* 2. APRESENTAÇÃO */}
      <PresentationSection />

      {/* 3. CRACHÁ PERSONALIZADO */}
      <BadgeSection />

      {/* 4. BRINDES */}
      <GiftsSection />

      {/* 5. PALESTRANTES */}
      <SpeakersSection />

      {/* 6. JORNADA DO PARTICIPANTE */}
      <JourneySection />

      {/* 7. INFORMAÇÕES DO EVENTO */}
      <EventInfoSection />

      {/* 8. PERGUNTAS FREQUENTES */}
      <FaqSection />

      {/* 9. CHAMADA FINAL + CAPTURA DE INSCRIÇÃO */}
      <div ref={registrationRef}>
        <RegistrationSection />
      </div>

      {/* 10. BOTÃO FLUTUANTE (só mobile, desaparece com final CTA em foco) */}
      <FloatingCta visible={showFloatingCta} onClick={scrollToRegistration} />
    </div>
  )
}
