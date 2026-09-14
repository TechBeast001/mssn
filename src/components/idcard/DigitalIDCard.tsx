import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { Member } from '../../types';
import {
  Download,
  Printer,
  RotateCw,
  ShieldCheck,
  Mail,
  CheckCircle2,
  Layers,
  FileDown,
  Sparkles,
  ExternalLink,
  Award,
  Check
} from 'lucide-react';
import { MSSNLogo } from '../common/MSSNLogo';
import { FUDLogo } from '../common/FUDLogo';

interface DigitalIDCardProps {
  member: Member;
  onClose?: () => void;
  onVerifyClick?: (membershipId: string) => void;
}

// Utility to load images for HTML5 Canvas with fallback
const loadImage = (src: string): Promise<HTMLImageElement | null> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
};

// Canvas rounded rectangle helper
const drawRoundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
};

export const DigitalIDCard: React.FC<DigitalIDCardProps> = ({
  member,
  onClose: _onClose,
  onVerifyClick
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [viewMode, setViewMode] = useState<'dual' | 'front' | 'back' | 'flip'>('dual');
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);
  const [emailSentAlert, setEmailSentAlert] = useState<boolean>(false);
  const cardAreaRef = useRef<HTMLDivElement>(null);

  // Generate QR Code containing the verification link
  useEffect(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://mssnfud.org';
    const verifyUrl = `${origin}?verify=${encodeURIComponent(member.membershipId)}`;

    QRCode.toDataURL(verifyUrl, {
      width: 280,
      margin: 1,
      color: {
        dark: '#063820',
        light: '#ffffff'
      }
    })
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error('Error generating QR code:', err));
  }, [member.membershipId]);

  // ==========================================
  // CANVAS DRAWING: FRONT OF THE CARD
  // ==========================================
  const renderFrontToCanvas = async (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    qrImg: HTMLImageElement | null,
    mssnImg: HTMLImageElement | null,
    fudImg: HTMLImageElement | null,
    photoImg: HTMLImageElement | null
  ) => {
    ctx.save();
    ctx.translate(x, y);

    // 1. Clip outer rounded badge
    drawRoundedRect(ctx, 0, 0, w, h, 20);
    ctx.clip();

    // 2. Base card background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, w, h);

    // Subtle background watermark pattern
    ctx.strokeStyle = '#F1F5F9';
    ctx.lineWidth = 1;
    for (let i = -w; i < w * 2; i += 36) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + h, h);
      ctx.stroke();
    }

    // 3. Top Header Bar (Deep Islamic Emerald)
    const headerGrad = ctx.createLinearGradient(0, 0, w, 0);
    headerGrad.addColorStop(0, '#042716');
    headerGrad.addColorStop(0.5, '#074828');
    headerGrad.addColorStop(1, '#042716');
    ctx.fillStyle = headerGrad;
    ctx.fillRect(0, 0, w, 136);

    // Gold separator accent line
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(0, 132, w, 4);

    // Dual Logos on Header
    if (mssnImg) {
      ctx.drawImage(mssnImg, 26, 20, 88, 88);
    } else {
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(70, 64, 42, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#063820';
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('MSSN', 70, 62);
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('FUD', 70, 78);
    }

    if (fudImg) {
      ctx.drawImage(fudImg, 122, 20, 88, 88);
    }

    // Institutional Header Titles
    ctx.textAlign = 'left';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 23px "Plus Jakarta Sans", sans-serif';
    ctx.fillText("MUSLIM STUDENTS' SOCIETY OF NIGERIA", 228, 48);

    ctx.fillStyle = '#FDE68A';
    ctx.font = 'bold 17px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('FEDERAL UNIVERSITY DUTSE CHAPTER (MSSN FUD)', 228, 77);

    ctx.fillStyle = '#A7F3D0';
    ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('OFFICIAL STUDENT MEMBERSHIP DIGITAL SMART e-ID', 228, 104);

    // Verified badge pill on top right
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    drawRoundedRect(ctx, w - 150, 36, 126, 56, 12);
    ctx.fill();
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#FDE68A';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('★ VERIFIED ★', w - 87, 59);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '600 10px sans-serif';
    ctx.fillText('STUDENT MEMBER', w - 87, 76);
    ctx.textAlign = 'left';

    // 4. Photo on Left
    const photoX = 42;
    const photoY = 162;
    const photoW = 210;
    const photoH = 260;

    ctx.save();
    drawRoundedRect(ctx, photoX, photoY, photoW, photoH, 14);
    ctx.clip();
    if (photoImg) {
      ctx.drawImage(photoImg, photoX, photoY, photoW, photoH);
    } else {
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(photoX, photoY, photoW, photoH);
      ctx.fillStyle = '#64748B';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('STUDENT PHOTO', photoX + photoW / 2, photoY + photoH / 2);
      ctx.textAlign = 'left';
    }
    // Level tag over photo bottom
    ctx.fillStyle = '#063820';
    ctx.fillRect(photoX, photoY + photoH - 34, photoW, 34);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${member.level} LEVEL`, photoX + photoW / 2, photoY + photoH - 12);
    ctx.restore();

    // Photo Border
    ctx.strokeStyle = '#063820';
    ctx.lineWidth = 3;
    drawRoundedRect(ctx, photoX, photoY, photoW, photoH, 14);
    ctx.stroke();

    // Session badge pill under photo
    ctx.fillStyle = '#ECFDF5';
    drawRoundedRect(ctx, photoX, 436, photoW, 30, 8);
    ctx.fill();
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = '#065F46';
    ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`SESSION: ${member.session}`, photoX + photoW / 2, 456);
    ctx.textAlign = 'left';

    // 5. Member Details (Center Column)
    const detailX = 280;

    // Full Name
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 26px "Plus Jakarta Sans", sans-serif';
    const cleanName = member.fullName.toUpperCase();
    ctx.fillText(cleanName.length > 28 ? cleanName.substring(0, 26) + '...' : cleanName, detailX, 192);

    // Membership ID badge
    ctx.fillStyle = '#ECFDF5';
    drawRoundedRect(ctx, detailX, 206, 260, 32, 8);
    ctx.fill();
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#064E3B';
    ctx.font = 'bold 16px monospace';
    ctx.fillText(`ID: ${member.membershipId}`, detailX + 12, 228);

    // Data Row Helper
    const drawRow = (label: string, value: string, rowY: number) => {
      ctx.fillStyle = '#64748B';
      ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(label, detailX, rowY);

      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
      const truncated = value.length > 30 ? value.substring(0, 28) + '...' : value;
      ctx.fillText(truncated, detailX + 110, rowY);

      // Light underline
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(detailX, rowY + 8);
      ctx.lineTo(detailX + 460, rowY + 8);
      ctx.stroke();
    };

    drawRow('MATRIC NO:', member.matricNumber, 272);
    drawRow('FACULTY:', member.faculty, 312);
    drawRow('DEPT:', member.department, 352);
    drawRow('COMMITTEE:', member.committeePreference, 392);
    drawRow('STATUS:', 'Active Bona Fide Member', 432);

    // 6. QR Code (Right Column)
    const qrX = 760;
    const qrY = 162;
    const qrBoxW = 210;
    const qrBoxH = 250;

    ctx.fillStyle = '#FFFFFF';
    drawRoundedRect(ctx, qrX, qrY, qrBoxW, qrBoxH, 14);
    ctx.fill();
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    if (qrImg) {
      ctx.drawImage(qrImg, qrX + 15, qrY + 15, 180, 180);
    }

    ctx.fillStyle = '#063820';
    ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SCAN TO VERIFY', qrX + qrBoxW / 2, qrY + 214);

    ctx.fillStyle = '#64748B';
    ctx.font = '600 10px monospace';
    ctx.fillText(member.securityHash || 'FUD-SEC-VERIFIED', qrX + qrBoxW / 2, qrY + 234);
    ctx.textAlign = 'left';

    // 7. Footer Bar (Signatures & Security Watermark)
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(0, 520, w, 118);
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, 520);
    ctx.lineTo(w, 520);
    ctx.stroke();

    // Signatures
    // Left: Amir MSSN FUD
    ctx.fillStyle = '#063820';
    ctx.font = 'bold 18px "Traditional Arabic", "Amiri", serif';
    ctx.fillText('إبراهيم عثمان (Amir)', 70, 560);
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(60, 570);
    ctx.lineTo(240, 570);
    ctx.stroke();
    ctx.fillStyle = '#64748B';
    ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Amir, MSSN FUD Chapter', 80, 588);

    // Center-Right: Staff Adviser
    ctx.fillStyle = '#0F172A';
    ctx.font = 'italic bold 16px "Georgia", serif';
    ctx.fillText('Dr. M. Haruna', 380, 560);
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(350, 570);
    ctx.lineTo(510, 570);
    ctx.stroke();
    ctx.fillStyle = '#64748B';
    ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Grand Patron / Staff Adviser', 360, 588);

    // Right: Institutional validation seal text
    ctx.fillStyle = '#047857';
    ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('AUTHORIZED DIGITAL CREDENTIAL', w - 40, 555);
    ctx.fillStyle = '#64748B';
    ctx.font = '500 10px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Central Mosque, Federal University Dutse, Jigawa', w - 40, 575);
    ctx.fillText('Official Portal: www.mssnfud.org', w - 40, 595);
    ctx.textAlign = 'left';

    ctx.restore();
  };

  // ==========================================
  // CANVAS DRAWING: BACK OF THE CARD
  // ==========================================
  const renderBackToCanvas = async (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    mssnImg: HTMLImageElement | null
  ) => {
    ctx.save();
    ctx.translate(x, y);

    // 1. Clip outer rounded badge
    drawRoundedRect(ctx, 0, 0, w, h, 20);
    ctx.clip();

    // 2. Base deep emerald Islamic texture background
    const backGrad = ctx.createLinearGradient(0, 0, w, h);
    backGrad.addColorStop(0, '#032012');
    backGrad.addColorStop(0.5, '#063820');
    backGrad.addColorStop(1, '#02180E');
    ctx.fillStyle = backGrad;
    ctx.fillRect(0, 0, w, h);

    // Subtle gold framing border
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 3;
    drawRoundedRect(ctx, 16, 16, w - 32, h - 32, 14);
    ctx.stroke();

    // 3. Holy Quran Ayah Header
    ctx.fillStyle = '#FDE68A';
    ctx.font = 'bold 23px "Traditional Arabic", "Amiri", serif';
    ctx.textAlign = 'center';
    ctx.fillText('وَاعْتَصِمُوا بِحَبْلِ اللَّهِ جَمِيعًا وَلَا تَفَرَّقُوا', w / 2, 60);

    ctx.fillStyle = '#A7F3D0';
    ctx.font = 'italic 600 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(
      '"And hold firmly to the rope of Allah all together and do not become divided" (Surah Ali \'Imran 3:103)',
      w / 2,
      86
    );

    // 4. Digital Barcode Strip (Simulated Magnetic & Barcode Security)
    ctx.fillStyle = '#011209';
    ctx.fillRect(20, 108, w - 40, 48);

    // Simulated Barcode lines
    ctx.fillStyle = '#FFFFFF';
    for (let bx = 50; bx < w - 50; bx += Math.floor(Math.sin(bx) * 3 + 6)) {
      const lineW = (bx % 3 === 0 ? 3 : 1.5);
      ctx.fillRect(bx, 114, lineW, 36);
    }
    // Centered barcode ID text
    ctx.fillStyle = '#FDE68A';
    ctx.font = 'bold 12px monospace';
    ctx.fillText(`* ${member.membershipId} *`, w / 2, 180);

    // 5. Terms & Regulations
    ctx.textAlign = 'left';
    ctx.fillStyle = '#FBBF24';
    ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('TERMS OF ISSUANCE & USAGE REGULATIONS', 45, 218);

    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(45, 226);
    ctx.lineTo(w - 45, 226);
    ctx.stroke();

    const rules = [
      '1. This digital credential verifies bona fide student membership in MSSN Federal University Dutse Chapter.',
      '2. Entitles the bearer to subsidized chapter materials, free faculty exam tutorials, and student welfare support.',
      '3. Non-transferable; must be produced upon demand for verification by authorized chapter executive officers.',
      '4. If found, please return to MSSN FUD Chapter Secretariat, Central Mosque, Federal University Dutse, Jigawa State.'
    ];

    ctx.fillStyle = '#F1F5F9';
    ctx.font = '500 13px "Plus Jakarta Sans", sans-serif';
    rules.forEach((rule, idx) => {
      ctx.fillText(rule, 45, 258 + idx * 32);
    });

    // 6. Secretariat Helpdesk & Location Box
    ctx.fillStyle = '#02160C';
    drawRoundedRect(ctx, 35, 410, w - 70, 175, 12);
    ctx.fill();
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Secretariat Details on left
    ctx.fillStyle = '#FDE68A';
    ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('MSSN FUD CHAPTER SECRETARIAT', 60, 442);

    ctx.fillStyle = '#CBD5E1';
    ctx.font = '500 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Adjacent Central Mosque, Federal University Dutse, P.M.B. 7156, Dutse, Jigawa State.', 60, 468);
    ctx.fillText('Helpline / WhatsApp: +234 803 123 4567   |   Email: secretariat@mssnfud.org', 60, 492);
    ctx.fillText('Official Portal & QR Verification: https://mssnfud.org', 60, 516);

    // Security Seal watermark on right
    if (mssnImg) {
      ctx.globalAlpha = 0.45;
      ctx.drawImage(mssnImg, w - 190, 430, 110, 110);
      ctx.globalAlpha = 1.0;
    }

    ctx.fillStyle = '#F59E0B';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`SECURITY HASH: ${member.securityHash || 'FUD-SEC-89C4'}`, w - 60, 560);
    ctx.textAlign = 'left';

    ctx.restore();
  };

  // ==========================================
  // DOWNLOAD BOTH SIDES (COMBINED BADGE SHEET)
  // ==========================================
  const handleDownloadCombinedSheet = async () => {
    setIsDownloading(true);
    try {
      const [mssnImg, fudImg, photoImg] = await Promise.all([
        loadImage('/mssn_logo.jpg'),
        loadImage('/fud_logo.jpg'),
        loadImage(member.photoUrl)
      ]);

      let qrImg: HTMLImageElement | null = null;
      if (qrCodeUrl) {
        qrImg = await loadImage(qrCodeUrl);
      }

      // High-res composite canvas (Side-by-Side Dual Badge Sheet for easy printing & laminating)
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const cardW = 1012;
      const cardH = 638;

      canvas.width = cardW * 2 + 160; // 2184 px wide
      canvas.height = cardH + 280; // 918 px high

      // Background backdrop
      ctx.fillStyle = '#04180E';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Top Presentation Header
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 28px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        "MUSLIM STUDENTS' SOCIETY OF NIGERIA • FEDERAL UNIVERSITY DUTSE CHAPTER",
        canvas.width / 2,
        54
      );

      ctx.fillStyle = '#FDE68A';
      ctx.font = 'bold 17px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(
        'OFFICIAL DIGITAL STUDENT MEMBERSHIP BADGE • COMPLETE TWO-SIDED PRINT & LAMINATE SHEET',
        canvas.width / 2,
        86
      );

      // Side Labels
      ctx.fillStyle = '#A7F3D0';
      ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('▲ FRONT SIDE (BADGE FACE)', 60, 126);
      ctx.fillText('▲ BACK SIDE (TERMS, MOSQUE SECRETARIAT & SEAL)', cardW + 100, 126);

      // Draw Front Card
      await renderFrontToCanvas(ctx, 60, 140, cardW, cardH, qrImg, mssnImg, fudImg, photoImg);

      // Draw Back Card
      await renderBackToCanvas(ctx, cardW + 100, 140, cardW, cardH, mssnImg);

      // Center fold / cut guideline
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.moveTo(cardW + 80, 130);
      ctx.lineTo(cardW + 80, cardH + 160);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#FDE68A';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✂ CUT / FOLD HERE', cardW + 80, cardH + 180);

      // Bottom Instructions
      ctx.fillStyle = '#CBD5E1';
      ctx.font = '500 13px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(
        `Member: ${member.fullName.toUpperCase()}  |  Matric: ${member.matricNumber}  |  ID: ${member.membershipId}  |  Session: ${member.session}`,
        canvas.width / 2,
        canvas.height - 40
      );

      ctx.fillStyle = '#6EE7B7';
      ctx.font = 'italic 12px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(
        'Standard PVC / Photo Paper CR80 size (85.6mm × 54mm per side). Fold along the center dashed line, insert into badge pouch or laminate.',
        canvas.width / 2,
        canvas.height - 18
      );

      const dataUri = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${member.membershipId.replace(/\//g, '_')}_${member.fullName.replace(/\s+/g, '_')}_Full_ID_Front_and_Back.png`;
      link.href = dataUri;
      link.click();

      setDownloadSuccessMessage('Downloaded complete dual-sided e-ID badge sheet (Front & Back)!');
      setTimeout(() => setDownloadSuccessMessage(null), 4000);
    } catch (err) {
      console.error('Failed to export dual canvas:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  // ==========================================
  // DOWNLOAD 2 SEPARATE FILES (FRONT & BACK)
  // ==========================================
  const handleDownloadSeparateFiles = async () => {
    setIsDownloading(true);
    try {
      const [mssnImg, fudImg, photoImg] = await Promise.all([
        loadImage('/mssn_logo.jpg'),
        loadImage('/fud_logo.jpg'),
        loadImage(member.photoUrl)
      ]);

      let qrImg: HTMLImageElement | null = null;
      if (qrCodeUrl) {
        qrImg = await loadImage(qrCodeUrl);
      }

      const cardW = 1012;
      const cardH = 638;

      // 1. FRONT FILE
      const frontCanvas = document.createElement('canvas');
      frontCanvas.width = cardW;
      frontCanvas.height = cardH;
      const frontCtx = frontCanvas.getContext('2d');
      if (frontCtx) {
        await renderFrontToCanvas(frontCtx, 0, 0, cardW, cardH, qrImg, mssnImg, fudImg, photoImg);
        const frontUri = frontCanvas.toDataURL('image/png');
        const frontLink = document.createElement('a');
        frontLink.download = `${member.membershipId.replace(/\//g, '_')}_${member.fullName.replace(/\s+/g, '_')}_ID_FRONT.png`;
        frontLink.href = frontUri;
        frontLink.click();
      }

      // Small delay for browser file-saving pipeline
      await new Promise((r) => setTimeout(r, 400));

      // 2. BACK FILE
      const backCanvas = document.createElement('canvas');
      backCanvas.width = cardW;
      backCanvas.height = cardH;
      const backCtx = backCanvas.getContext('2d');
      if (backCtx) {
        await renderBackToCanvas(backCtx, 0, 0, cardW, cardH, mssnImg);
        const backUri = backCanvas.toDataURL('image/png');
        const backLink = document.createElement('a');
        backLink.download = `${member.membershipId.replace(/\//g, '_')}_${member.fullName.replace(/\s+/g, '_')}_ID_BACK.png`;
        backLink.href = backUri;
        backLink.click();
      }

      setDownloadSuccessMessage('Downloaded both Front and Back as separate PNG images!');
      setTimeout(() => setDownloadSuccessMessage(null), 4000);
    } catch (err) {
      console.error('Failed to export separate files:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSimulateEmail = () => {
    setEmailSentAlert(true);
    setTimeout(() => setEmailSentAlert(false), 5000);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
      {/* 1. TOP CONTROL BAR */}
      <div className="w-full flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-4 no-print bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setViewMode('dual')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              viewMode === 'dual'
                ? 'bg-[#06331E] text-amber-300 shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Dual View (Both Sides)</span>
          </button>

          <button
            onClick={() => setViewMode('front')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer shrink-0 ${
              viewMode === 'front'
                ? 'bg-[#06331E] text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Front Side
          </button>

          <button
            onClick={() => setViewMode('back')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer shrink-0 ${
              viewMode === 'back'
                ? 'bg-[#06331E] text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Back Side
          </button>

          <button
            onClick={() => {
              setViewMode('flip');
              setIsFlipped((f) => !f);
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
              viewMode === 'flip'
                ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
            title="Interactive 3D Card Flip"
          >
            <RotateCw className={`w-3.5 h-3.5 ${viewMode === 'flip' ? 'animate-spin' : ''}`} />
            <span>3D Flip</span>
          </button>
        </div>

        {/* Download & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* PRIMARY DOWNLOAD: BOTH SIDES */}
          <button
            onClick={handleDownloadCombinedSheet}
            disabled={isDownloading}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs font-black bg-[#06331E] hover:bg-[#0B4D2C] text-amber-300 rounded-xl shadow-xs transition-colors cursor-pointer border border-emerald-700/50"
            title="Download high-resolution presentation card containing both Front and Back"
          >
            <Download className="w-4 h-4 text-amber-300" />
            <span>{isDownloading ? 'Generating...' : 'Download Both Sides (Full Badge)'}</span>
          </button>

          {/* SECONDARY DOWNLOAD: 2 INDIVIDUAL FILES */}
          <button
            onClick={handleDownloadSeparateFiles}
            disabled={isDownloading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white hover:bg-slate-100 text-slate-800 rounded-xl border border-slate-200 shadow-xs transition-colors cursor-pointer"
            title="Download Front and Back as two separate PNG files"
          >
            <FileDown className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden sm:inline">Separate PNGs</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-900 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
            title="Print high-resolution dual-sided badge"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          <button
            onClick={handleSimulateEmail}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-100 hover:bg-emerald-200 text-[#06331E] rounded-xl border border-emerald-300 transition-colors cursor-pointer"
            title="Send Backup to Student Email"
          >
            <Mail className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Email Copy</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {downloadSuccessMessage && (
        <div className="w-full mb-3 p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs flex items-center justify-between no-print animate-fade-in shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{downloadSuccessMessage}</span>
          </div>
          <button
            onClick={() => setDownloadSuccessMessage(null)}
            className="text-emerald-800 hover:underline text-xs cursor-pointer font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {emailSentAlert && (
        <div className="w-full mb-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-center justify-between no-print animate-fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#0F5132] shrink-0" />
            <span>
              Official backup e-ID badge copy sent to <strong>{member.email}</strong>.
            </span>
          </div>
          <button onClick={() => setEmailSentAlert(false)} className="text-[#0F5132] hover:underline text-xs cursor-pointer font-semibold">
            Dismiss
          </button>
        </div>
      )}

      {/* 2. PRINTABLE AND VISIBLE CARD AREA */}
      <div id="id-card-print-area" ref={cardAreaRef} className="w-full flex flex-col items-center py-2">
        {/* VIEW MODE A: DUAL VIEW (SHOW BOTH FRONT AND BACK SIDE-BY-SIDE) */}
        {viewMode === 'dual' && (
          <div className="w-full space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 justify-items-center">
              {/* FRONT CARD WRAPPER */}
              <div className="w-full max-w-[500px] flex flex-col items-center space-y-2">
                <div className="flex items-center justify-between w-full px-1 text-xs font-bold text-emerald-900">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Front Side (Official Badge)
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Standard CR80</span>
                </div>

                <div className="w-full aspect-[85.6/54] rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-white select-none transition-all relative">
                  <CardFrontContent member={member} qrCodeUrl={qrCodeUrl} />
                </div>
              </div>

              {/* BACK CARD WRAPPER */}
              <div className="w-full max-w-[500px] flex flex-col items-center space-y-2">
                <div className="flex items-center justify-between w-full px-1 text-xs font-bold text-emerald-900">
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    Back Side (Terms, Ayah & Mosque Secretariat)
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Verification & Seal</span>
                </div>

                <div className="w-full aspect-[85.6/54] rounded-2xl overflow-hidden shadow-xl border border-emerald-950 bg-[#06331E] select-none transition-all relative">
                  <CardBackContent member={member} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW MODE B: FRONT ONLY */}
        {viewMode === 'front' && (
          <div className="w-full max-w-[540px] aspect-[85.6/54] rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-white select-none transition-all relative animate-fade-in">
            <CardFrontContent member={member} qrCodeUrl={qrCodeUrl} />
          </div>
        )}

        {/* VIEW MODE C: BACK ONLY */}
        {viewMode === 'back' && (
          <div className="w-full max-w-[540px] aspect-[85.6/54] rounded-2xl overflow-hidden shadow-2xl border border-emerald-950 bg-[#06331E] select-none transition-all relative animate-fade-in">
            <CardBackContent member={member} />
          </div>
        )}

        {/* VIEW MODE D: 3D FLIP VIEW */}
        {viewMode === 'flip' && (
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full max-w-[540px] aspect-[85.6/54] cursor-pointer group perspective-1000 select-none"
            title="Click to flip card"
          >
            <div
              className={`relative w-full h-full duration-700 transform-style-3d transition-transform ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
            >
              {/* FRONT FACE */}
              <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-white">
                <CardFrontContent member={member} qrCodeUrl={qrCodeUrl} />
              </div>

              {/* BACK FACE */}
              <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl overflow-hidden shadow-2xl border border-emerald-950 bg-[#06331E]">
                <CardBackContent member={member} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. QUICK VERIFICATION LINK & INSTRUCTIONS */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 w-full max-w-4xl px-2 text-xs no-print text-slate-500 border-t border-slate-200 pt-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>
            Real-time biometric & QR credential issued by <strong>MSSN FUD Chapter</strong>.
          </span>
        </div>

        <button
          onClick={() => onVerifyClick && onVerifyClick(member.membershipId)}
          className="text-xs text-[#06331E] hover:text-emerald-700 font-bold flex items-center gap-1 cursor-pointer transition-colors"
        >
          <span>Test Public Verification Portal</span>
          <ExternalLink className="w-3.5 h-3.5 text-amber-600" />
        </button>
      </div>
    </div>
  );
};

// =========================================================================
// SUBCOMPONENT: FRONT CARD CONTENT (HTML / Tailwind Preview)
// =========================================================================
const CardFrontContent: React.FC<{ member: Member; qrCodeUrl: string }> = ({ member, qrCodeUrl }) => {
  return (
    <div className="relative w-full h-full flex flex-col justify-between p-3.5 sm:p-4 bg-white text-slate-900">
      {/* Background Watermark Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#063820_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Header Bar */}
      <div className="relative z-10 flex items-center justify-between pb-2 border-b-2 border-amber-400 bg-gradient-to-r from-[#042716] via-[#074828] to-[#042716] -mx-4 -mt-4 px-4 pt-3 text-white">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="flex items-center gap-1 shrink-0">
            <MSSNLogo size={36} className="bg-white rounded-full p-0.5" />
            <FUDLogo size={36} className="bg-white rounded-full p-0.5" />
          </div>

          <div className="text-left">
            <h3 className="font-extrabold text-[10px] sm:text-xs text-white uppercase tracking-tight leading-tight">
              Muslim Students' Society of Nigeria
            </h3>
            <p className="text-[8.5px] sm:text-[10px] font-bold text-amber-300 tracking-wide leading-tight">
              FEDERAL UNIVERSITY DUTSE CHAPTER
            </p>
            <p className="text-[7px] sm:text-[8px] font-bold text-emerald-200 uppercase tracking-wider">
              Official Digital Student Membership Card
            </p>
          </div>
        </div>

        {/* Verified Hologram Tag */}
        <div className="flex flex-col items-center justify-center px-2 py-0.5 rounded-lg bg-white/15 border border-amber-300/60 text-amber-300 shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[6.5px] sm:text-[7.5px] font-black tracking-wider uppercase">VERIFIED</span>
        </div>
      </div>

      {/* Card Body Grid */}
      <div className="relative z-10 grid grid-cols-12 gap-2.5 sm:gap-3 items-center my-auto py-1">
        {/* Left Column: Member Photo */}
        <div className="col-span-4 flex flex-col items-center">
          <div className="relative w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden border-2 border-[#063820] ring-2 ring-amber-400/80 shadow-md bg-slate-100">
            <img
              src={member.photoUrl}
              alt={member.fullName}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80';
              }}
            />
            <div className="absolute bottom-0 inset-x-0 bg-[#063820] text-white text-[7.5px] sm:text-[8.5px] font-black text-center py-0.5 uppercase tracking-wider">
              {member.level} LEVEL
            </div>
          </div>
          <span className="mt-1 text-[7px] sm:text-[8px] font-extrabold text-[#065F46] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            {member.session}
          </span>
        </div>

        {/* Center Column: Credentials */}
        <div className="col-span-5 flex flex-col justify-center space-y-0.5 text-left pr-1">
          <div>
            <h4 className="font-black text-xs sm:text-sm text-slate-900 tracking-tight leading-snug line-clamp-1">
              {member.fullName.toUpperCase()}
            </h4>
            <div className="inline-block px-1.5 py-0.5 bg-emerald-50 border border-emerald-300 rounded text-[8.5px] sm:text-[10px] font-bold text-[#063820] font-mono tracking-tight my-0.5">
              ID: {member.membershipId}
            </div>
          </div>

          <div className="text-[8px] sm:text-[9.5px] space-y-0.5 text-slate-600 font-medium">
            <p className="flex items-center gap-1">
              <span className="text-slate-400 font-semibold">Matric:</span>
              <span className="font-extrabold text-slate-900 font-mono">{member.matricNumber}</span>
            </p>
            <p className="line-clamp-1">
              <span className="text-slate-400 font-semibold">Faculty:</span>
              <span className="text-slate-800 font-semibold ml-1">{member.faculty}</span>
            </p>
            <p className="line-clamp-1">
              <span className="text-slate-400 font-semibold">Dept:</span>
              <span className="text-slate-800 font-semibold ml-1">{member.department}</span>
            </p>
            <p className="line-clamp-1">
              <span className="text-slate-400 font-semibold">Wing:</span>
              <span className="text-[#063820] font-bold ml-1">{member.committeePreference}</span>
            </p>
          </div>
        </div>

        {/* Right Column: QR Code */}
        <div className="col-span-3 flex flex-col items-center justify-center text-center">
          <div className="p-1 bg-white rounded-xl border border-slate-200 shadow-sm">
            {qrCodeUrl ? (
              <img src={qrCodeUrl} alt="Verify QR" className="w-14 h-14 sm:w-16 sm:h-16" />
            ) : (
              <div className="w-14 h-14 bg-slate-100 flex items-center justify-center text-[7px] text-slate-400">
                QR Code
              </div>
            )}
          </div>
          <span className="text-[6.5px] sm:text-[7.5px] font-black text-[#063820] uppercase tracking-wider mt-1">
            SCAN TO VERIFY
          </span>
          <span className="text-[6px] font-mono text-slate-400 tracking-tighter truncate max-w-full">
            {member.securityHash || 'FUD-SEC-VERIFIED'}
          </span>
        </div>
      </div>

      {/* Card Footer: Signatures & Validation */}
      <div className="relative z-10 pt-1.5 border-t border-slate-200 flex items-center justify-between text-[7px] sm:text-[8px] text-slate-500">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
          <span className="font-bold text-[#063820]">Valid: {member.session} Academic Session</span>
        </div>

        {/* Signatures */}
        <div className="flex items-center gap-2 sm:gap-3 text-center">
          <div className="flex flex-col">
            <span className="text-[8px] font-serif text-[#063820] font-bold leading-none">إبراهيم عثمان</span>
            <span className="text-[5.5px] text-slate-400 border-t border-slate-200 px-1 mt-0.5">Amir MSSN FUD</span>
          </div>
          <div className="flex flex-col">
            <span className="italic text-[7.5px] text-slate-700 font-bold leading-none">Dr. M. Haruna</span>
            <span className="text-[5.5px] text-slate-400 border-t border-slate-200 px-1 mt-0.5">Staff Adviser</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// SUBCOMPONENT: BACK CARD CONTENT (HTML / Tailwind Preview)
// =========================================================================
const CardBackContent: React.FC<{ member: Member }> = ({ member }) => {
  return (
    <div className="relative w-full h-full flex flex-col justify-between p-3.5 sm:p-4 bg-gradient-to-br from-[#032012] via-[#063820] to-[#02180E] text-white">
      {/* Decorative Gold Frame */}
      <div className="absolute inset-1 rounded-xl border border-amber-400/40 pointer-events-none" />

      {/* Quranic Motto Header */}
      <div className="relative z-10 text-center pb-1 border-b border-white/15">
        <p className="text-amber-300 text-xs sm:text-sm font-serif font-bold tracking-wide">
          وَاعْتَصِمُوا بِحَبْلِ اللَّهِ جَمِيعًا وَلَا تَفَرَّقُوا
        </p>
        <p className="text-[7px] sm:text-[8.5px] text-emerald-100 italic mt-0.5">
          "And hold firmly to the rope of Allah all together and do not become divided" (Surah Ali 'Imran 3:103)
        </p>
      </div>

      {/* Simulated Magnetic / Barcode Strip */}
      <div className="relative z-10 bg-black/40 rounded-lg p-1 text-center my-0.5 border border-white/5">
        <div className="h-4 sm:h-5 bg-black/60 rounded flex items-center justify-center overflow-hidden px-2">
          {/* Barcode Lines Graphic */}
          <div className="flex items-center gap-[2px] opacity-80 h-3">
            {Array.from({ length: 48 }).map((_, i) => (
              <div
                key={i}
                className="bg-white h-full"
                style={{
                  width: i % 4 === 0 ? '3px' : i % 2 === 0 ? '1.5px' : '1px'
                }}
              />
            ))}
          </div>
        </div>
        <p className="text-[7.5px] font-mono font-bold text-amber-300 tracking-wider mt-0.5">
          * {member.membershipId} *
        </p>
      </div>

      {/* Terms & Usage Guidelines */}
      <div className="relative z-10 text-[7px] sm:text-[8px] text-slate-200 space-y-0.5 text-left">
        <p className="font-black text-amber-400 uppercase tracking-wider text-[7.5px]">
          TERMS OF ISSUANCE & USAGE REGULATIONS
        </p>
        <ul className="list-disc pl-3 space-y-0.5 text-emerald-100/90 leading-tight">
          <li>Valid proof of bona fide student membership in MSSN Federal University Dutse Chapter.</li>
          <li>Entitles bearer to subsidized chapter materials, free faculty tutorials, and welfare relief.</li>
          <li>Non-transferable; must be presented upon request during chapter assemblies and programs.</li>
          <li>If found, please return to MSSN Secretariat, Central Mosque, FUD Main Campus, Dutse.</li>
        </ul>
      </div>

      {/* Secretariat & Emergency Contact */}
      <div className="relative z-10 pt-1.5 border-t border-white/15 flex items-center justify-between text-[7px] sm:text-[8px]">
        <div className="text-left">
          <p className="font-black text-amber-300 leading-tight">MSSN FUD Chapter Secretariat</p>
          <p className="text-slate-300 text-[6.5px] sm:text-[7.5px] leading-tight">
            Adjacent Central Mosque, Federal University Dutse, Jigawa State
          </p>
          <p className="text-emerald-300 font-mono text-[6.5px] sm:text-[7px]">
            Helpdesk: +234 803 123 4567 | secretariat@mssnfud.org | www.mssnfud.org
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[6px] text-emerald-300 uppercase tracking-wider block">Security Hash</span>
          <span className="font-mono text-[7px] sm:text-[8.5px] text-amber-300 font-bold">
            {member.securityHash || 'FUD-SEC-VALID'}
          </span>
        </div>
      </div>
    </div>
  );
};
