// Status Halaman: 0 = Menu Utama Bohlam, 1 = Materi, 2 = Simulasi, 3 = LKS
let currentPage = 0;

// Tombol Navigasi
let btnKembali;

// --- ELEMENT KONTROL SIMULASI (PAGE 2) ---
let sliderV, sliderR1, sliderR2, radioMode;
let btnToggleSwitch;
let switchState = true;

// State Kehadiran Alat Ukur (Active / Docked)
let showVoltmeter = false;
let showAmmeter = false;
let btnVoltToggle, btnAmpToggle;

// Animasi Muatan & History Data Grafik
let offsetTotal = 0, offset1 = 0, offset2 = 0;
let graphHistory = [];

// Alat Ukur Drag-and-Drop
let voltmeter = { x: 340, y: 180, isDragging: false, offsetX: 0, offsetY: 0 };
let ammeter   = { x: 380, y: 180, isDragging: false, offsetX: 0, offsetY: 0 };

// --- ELEMENT LKS (PAGE 3) ---
let inputJawab1, inputJawab2, btnCekLKS;
let feedbackLKS = "";

function setup() {
  createCanvas(1080, 620);

  // Tombol Kembali
  btnKembali = createButton('← Kembali ke Menu Utama');
  btnKembali.position(20, 15);
  btnKembali.style('background-color', '#0284C7');
  btnKembali.style('color', 'white');
  btnKembali.style('border-radius', '6px');
  btnKembali.style('border', 'none');
  btnKembali.style('padding', '6px 12px');
  btnKembali.style('font-weight', 'bold');
  btnKembali.style('cursor', 'pointer');
  btnKembali.mousePressed(() => switchPage(0));

  // KONTROL SIMULATOR (PAGE 2)
  radioMode = createRadio();
  radioMode.option('seri', 'Rangkaian Seri');
  radioMode.option('paralel', 'Rangkaian Paralel');
  radioMode.selected('seri');
  radioMode.position(25, 60);
  styleRadio(radioMode);

  sliderV = createSlider(1, 24, 12, 1);
  sliderV.position(25, 125);
  styleSlider(sliderV);

  sliderR1 = createSlider(1, 100, 10, 1);
  sliderR1.position(25, 185);
  styleSlider(sliderR1);

  sliderR2 = createSlider(1, 100, 20, 1);
  sliderR2.position(25, 245);
  styleSlider(sliderR2);

  btnToggleSwitch = createButton('⚡ SAKELAR: ON');
  btnToggleSwitch.position(25, 290);
  btnToggleSwitch.style('width', '200px');
  btnToggleSwitch.style('height', '36px');
  btnToggleSwitch.style('background-color', '#059669');
  btnToggleSwitch.style('color', '#FFFFFF');
  btnToggleSwitch.style('font-weight', 'bold');
  btnToggleSwitch.style('border-radius', '8px');
  btnToggleSwitch.style('border', 'none');
  btnToggleSwitch.style('cursor', 'pointer');
  btnToggleSwitch.mousePressed(toggleSwitch);

  // RAK ALAT UKUR (DOCKING BUTTONS)
  btnVoltToggle = createButton('📌 Ambil Voltmeter');
  btnVoltToggle.position(25, 480);
  btnVoltToggle.style('width', '200px');
  btnVoltToggle.style('height', '32px');
  btnVoltToggle.style('background-color', '#FEF3C7');
  btnVoltToggle.style('color', '#92400E');
  btnVoltToggle.style('font-weight', 'bold');
  btnVoltToggle.style('border', '1px solid #F59E0B');
  btnVoltToggle.style('border-radius', '6px');
  btnVoltToggle.style('cursor', 'pointer');
  btnVoltToggle.mousePressed(toggleVoltmeter);

  btnAmpToggle = createButton('📌 Ambil Amperemeter');
  btnAmpToggle.position(25, 520);
  btnAmpToggle.style('width', '200px');
  btnAmpToggle.style('height', '32px');
  btnAmpToggle.style('background-color', '#E0F2FE');
  btnAmpToggle.style('color', '#075985');
  btnAmpToggle.style('font-weight', 'bold');
  btnAmpToggle.style('border', '1px solid #0284C7');
  btnAmpToggle.style('border-radius', '6px');
  btnAmpToggle.style('cursor', 'pointer');
  btnAmpToggle.mousePressed(toggleAmmeter);

  // KONTROL LKS (PAGE 3)
  inputJawab1 = createInput('');
  inputJawab1.position(300, 240);
  inputJawab1.size(90);

  inputJawab2 = createInput('');
  inputJawab2.position(300, 320);
  inputJawab2.size(90);

  btnCekLKS = createButton('Periksa Jawaban');
  btnCekLKS.position(300, 370);
  btnCekLKS.style('background-color', '#059669');
  btnCekLKS.style('color', 'white');
  btnCekLKS.style('font-weight', 'bold');
  btnCekLKS.style('border-radius', '6px');
  btnCekLKS.style('border', 'none');
  btnCekLKS.style('padding', '8px 16px');
  btnCekLKS.style('cursor', 'pointer');
  btnCekLKS.mousePressed(periksaJawabanLKS);

  // Inisialisasi awal ke Menu Utama
  switchPage(0);
}

function switchPage(pageIndex) {
  currentPage = pageIndex;

  if (currentPage === 0) {
    btnKembali.hide();
  } else {
    btnKembali.show();
  }

  if (currentPage === 2) {
    radioMode.show(); sliderV.show(); sliderR1.show(); sliderR2.show();
    btnToggleSwitch.show(); btnVoltToggle.show(); btnAmpToggle.show();
  } else {
    radioMode.hide(); sliderV.hide(); sliderR1.hide(); sliderR2.hide();
    btnToggleSwitch.hide(); btnVoltToggle.hide(); btnAmpToggle.hide();
  }

  if (currentPage === 3) {
    inputJawab1.show(); inputJawab2.show(); btnCekLKS.show();
  } else {
    inputJawab1.hide(); inputJawab2.hide(); btnCekLKS.hide();
  }
}

function draw() {
  background(241, 245, 249);

  if (currentPage === 0) {
    drawBulbMenuCards();
  } else if (currentPage === 1) {
    drawPageMateri();
  } else if (currentPage === 2) {
    drawPageSimulasi();
  } else if (currentPage === 3) {
    drawPageLKS();
  }
}

// =====================================================================
// PAGE 0: MENU DENGAN BOHLAM LAMPU INTERAKTIF
// =====================================================================
function drawBulbMenuCards() {
  fill(30, 41, 59);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(24); textStyle(BOLD);
  text("Modul Fisika Interaktif: Rangkaian Listrik Seri dan Paralel", width / 2, 30);

  textSize(14); textStyle(BOLD);
  fill(0, 0, 128);
  text("Tim J: Adinda Amelia, Rizki Syahfina B, Wiji Susilowati", width / 2, 60);

  textSize(12); textStyle(NORMAL);
  fill(100, 116, 139);
  text("Klik salah satu lampu bohlam di bawah untuk menyalakan dan membuka panel!", width / 2, 80);

  // Kabel Penggantung Lampu dari Atas
  stroke(100, 116, 139); strokeWeight(3);
  line(200, 95, 200, 180);
  line(540, 95, 540, 180);
  line(880, 95, 880, 180);

  // Render 3 Lampu Bohlam Menu
  drawInteractiveBulb(200, 260, "1. Rumus & Teori", "Pelajari konsep dasar Hukum Ohm, Rangkaian Seri, Paralel & Kirchhoff.", color(2, 132, 199), 1);
  drawInteractiveBulb(540, 260, "2. Simulator Rangkaian", "Simulator interaktif pembagian arus, pendaran lampu, & instrumen.", color(217, 119, 6), 2);
  drawInteractiveBulb(880, 260, "3. Lembar Kerja Siswa", "Uji kemampuanmu menghitung nilai arus cabang dan hambatan.", color(5, 150, 105), 3);
}

function drawInteractiveBulb(x, y, title, desc, bulbColor, pageTarget) {
  push();
  
  // Cek apakah mouse mengarah ke bohlam ini (Hover detection)
  let isHover = dist(mouseX, mouseY, x, y) < 85;
  
  if (isHover) {
    cursor(HAND);
  }

  // 1. Pendar Cahaya Glow
  noStroke();
  let glowLayers = isHover ? 10 : 6;
  for (let r = glowLayers * 10; r > 0; r -= 8) {
    let alphaVal = map(r, 0, glowLayers * 10, isHover ? 100 : 40, 0);
    fill(red(bulbColor), green(bulbColor), blue(bulbColor), alphaVal);
    circle(x, y, 160 + r * 2);
  }

  // 2. Fitting / Dudukan Metal Lampu
  fill(148, 163, 184); stroke(71, 85, 105); strokeWeight(2);
  rect(x - 22, y - 95, 44, 25, 4);
  fill(100, 116, 139);
  rect(x - 18, y - 75, 36, 10, 2);

  // 3. Kaca Bohlam Lampu
  stroke(isHover ? bulbColor : color(148, 163, 184));
  strokeWeight(isHover ? 3.5 : 2);
  fill(red(bulbColor), green(bulbColor), blue(bulbColor), isHover ? 80 : 35);
  circle(x, y - 10, 140);

  // 4. Filamen Pijar di Dalam Lampu
  stroke(isHover ? color(255, 255, 200) : bulbColor);
  strokeWeight(2.5);
  noFill();
  beginShape();
  vertex(x - 20, y - 35);
  vertex(x - 10, y - 60);
  vertex(x, y - 45);
  vertex(x + 10, y - 60);
  vertex(x + 20, y - 35);
  endShape();

  // 5. Card Informasi di Bawah Lampu
  fill(255);
  stroke(isHover ? bulbColor : color(226, 232, 240));
  strokeWeight(isHover ? 2 : 1);
  rect(x - 130, y + 95, 260, 170, 12);

  // Judul & Deskripsi
  fill(30, 41, 59); noStroke(); textAlign(CENTER, TOP);
  textSize(15); textStyle(BOLD);
  text(title, x, y + 112);

  textSize(12); textStyle(NORMAL); fill(71, 85, 105);
  text(desc, x - 110, y + 140, 220, 80);

  // Tombol Buka Panel
  fill(isHover ? bulbColor : color(241, 245, 249));
  stroke(isHover ? bulbColor : color(203, 213, 225));
  rect(x - 90, y + 215, 180, 32, 6);

  fill(isHover ? 255 : color(71, 85, 105)); noStroke();
  textSize(11); textStyle(BOLD); textAlign(CENTER, CENTER);
  text("💡 Klik / Buka Panel", x, y + 231);

  pop();
}

// Handler Klik Mouse pada Bohlam Menu Utama
function mousePressed() {
  if (currentPage === 0) {
    if (dist(mouseX, mouseY, 200, 260) < 130) switchPage(1);
    if (dist(mouseX, mouseY, 540, 260) < 130) switchPage(2);
    if (dist(mouseX, mouseY, 880, 260) < 130) switchPage(3);
  } else if (currentPage === 2) {
    if (showVoltmeter && dist(mouseX, mouseY, voltmeter.x, voltmeter.y) < 35) {
      voltmeter.isDragging = true; voltmeter.offsetX = mouseX - voltmeter.x; voltmeter.offsetY = mouseY - voltmeter.y;
    }
    if (showAmmeter && dist(mouseX, mouseY, ammeter.x, ammeter.y) < 30) {
      ammeter.isDragging = true; ammeter.offsetX = mouseX - ammeter.x; ammeter.offsetY = mouseY - ammeter.y;
    }
  }
}

// =====================================================================
// PAGE 1: MATERI & TEORI
// =====================================================================
function drawPageMateri() {
  fill(30, 41, 59); noStroke(); textAlign(LEFT, TOP);
  textSize(20); textStyle(BOLD);
  text("Materi Rangkaian Seri & Paralel", 30, 65);

  fill(255); stroke(226, 232, 240); rect(30, 105, 490, 480, 10);
  fill(30, 41, 59); noStroke(); textStyle(BOLD); textSize(15);
  text("1. Rangkaian Seri", 50, 125);
  textStyle(NORMAL); textSize(13); fill(71, 85, 105);
  text("• Arus Listrik: Sama di setiap komponen (I_tot = I1 = I2)\n" +
       "• Hambatan Total: R_tot = R1 + R2\n" +
       "• Tegangan Listrik: Terbagi di tiap beban (V_tot = V1 + V2)\n\n" +
       "Sifat Utama:\nJika salah satu lampu terputus/mati, maka seluruh aliran listrik akan padam karena tidak ada jalur alternatif.", 50, 160, 450, 400);

  fill(255); stroke(226, 232, 240); rect(550, 105, 490, 480, 10);
  fill(30, 41, 59); noStroke(); textStyle(BOLD); textSize(15);
  text("2. Rangkaian Paralel (Hukum Kirchhoff I)", 570, 125);
  textStyle(NORMAL); textSize(13); fill(71, 85, 105);
  text("• Tegangan Listrik: Sama pada setiap cabang (V_tot = V1 = V2 = V)\n" +
       "• Hambatan Total: R_tot = (R1 · R2) / (R1 + R2)\n" +
       "• Hukum Kirchhoff Arus (I): Arus utama terbagi ke cabang:\n  I_tot = I1 + I2  (dengan I1 = V/R1 & I2 = V/R2)\n\n" +
       "Sifat Utama:\nJika salah satu cabang terputus, cabang lainnya tetap dapat mengalirkan arus secara independen.", 570, 160, 450, 400);
}

// =====================================================================
// PAGE 2: SIMULATOR INTERAKTIF LENGKAP
// =====================================================================
function drawPageSimulasi() {
  fill(100, 116, 139); noStroke(); textSize(12); textStyle(BOLD);
  textAlign(LEFT, CENTER);
  text(`Tegangan Sumber (V): ${sliderV.value()} V`, 25, 110);
  text(`Hambatan Lampu 1: ${sliderR1.value()} Ω`, 25, 170);
  text(`Hambatan Lampu 2: ${sliderR2.value()} Ω`, 25, 230);

  let V = sliderV.value();
  let R1 = sliderR1.value();
  let R2 = sliderR2.value();
  let mode = radioMode.value();

  let R_total = 0, I_total = 0, I1 = 0, I2 = 0;

  if (switchState) {
    if (mode === 'seri') {
      R_total = R1 + R2;
      I_total = V / R_total;
      I1 = I_total; I2 = I_total;
      offsetTotal += I_total * 0.8;
    } else {
      R_total = (R1 * R2) / (R1 + R2);
      I_total = V / R_total;
      I1 = V / R1; I2 = V / R2;
      offsetTotal += I_total * 0.8;
      offset1 += I1 * 0.8;
      offset2 += I2 * 0.8;
    }
  }

  graphHistory.push({ v: V, i: I_total });
  if (graphHistory.length > 60) graphHistory.shift();

  fill(255); stroke(226, 232, 240); strokeWeight(1);
  rect(10, 10, 230, 600, 12);

  fill(30, 41, 59); noStroke(); textSize(14); textStyle(BOLD); textAlign(LEFT, TOP);
  text("KONTROL RANGKAIAN", 25, 22);

  drawToolRack();

  fill(255); stroke(226, 232, 240); strokeWeight(1);
  rect(250, 10, 820, 270, 12);

  drawStatusBadge(880, 22, I_total, switchState);

  if (mode === 'seri') {
    drawSeriesVisual(V, R1, R2, I1, I2, switchState);
  } else {
    drawParallelVisual(V, R1, R2, I1, I2, switchState);
  }

  if (showVoltmeter) drawDraggableVoltmeter(switchState ? V : 0);
  if (showAmmeter) drawDraggableAmmeter(switchState ? I_total : 0);

  let P_total = V * I_total;
  drawMetricCard(250, 290, 260, 120, "HAMBATAN TOTAL", `${R_total.toFixed(2)} Ω`, mode === 'seri' ? "R_tot = R1 + R2" : "R_tot = (R1·R2)/(R1+R2)", "#0284C7");
  drawMetricCard(530, 290, 260, 120, "ARUS UTAMA", `${I_total.toFixed(2)} A`, "I_tot = V / R_tot", "#D97706");
  drawMetricCard(810, 290, 260, 120, "DAYA LISTRIK TOTAL", `${P_total.toFixed(1)} W`, "P = V · I", "#059669");

  drawDetailedLiveGraph(250, 420, 540, 190, V, I_total);
  drawTheoryPanel(810, 420, 260, 190, mode, I1, I2, R1, R2);
}

// =====================================================================
// PAGE 3: LEMBAR KERJA SISWA (LKS)
// =====================================================================
function drawPageLKS() {
  fill(30, 41, 59); noStroke(); textAlign(LEFT, TOP);
  textSize(18); textStyle(BOLD);
  text("Lembar Kerja Siswa (LKS) - Praktikum Mandiri", 30, 65);

  textSize(13); textStyle(NORMAL); fill(71, 85, 105);
  text("Instruksi Skenario Praktikum:\n" +
       "Buka '2. Simulator Rangkaian', atur mode Rangkaian Paralel dengan parameter berikut:\n" +
       "• Tegangan Sumber (V) = 12 V\n" +
       "• Hambatan Lampu 1 (R1) = 12 Ω\n" +
       "• Hambatan Lampu 2 (R2) = 24 Ω\n\n" +
       "Gunakan simulator untuk membantu menjawab pertanyaan di bawah ini:", 30, 95);

  textStyle(BOLD); fill(30, 41, 59);
  text("Soal 1: Berapakah besar Arus Utama Total (I_total) pada rangkaian?", 30, 245);
  text("A", 400, 245);

  text("Soal 2: Berapakah besar Arus Listrik pada Cabang 2 (I2)?", 30, 325);
  text("A", 400, 325);

  if (feedbackLKS !== "") {
    textSize(14);
    fill(feedbackLKS.includes("SEMPURNA") ? color(5, 150, 105) : color(220, 38, 38));
    text(feedbackLKS, 30, 420);
  }
}

function periksaJawabanLKS() {
  let val1 = parseFloat(inputJawab1.value());
  let val2 = parseFloat(inputJawab2.value());
  if (abs(val1 - 1.5) < 0.1 && abs(val2 - 0.5) < 0.1) {
    feedbackLKS = "✔ SEMPURNA! Semua jawaban kamu benar!\nKonsep Hukum Kirchhoff dan Hambatan Pengganti sudah tepat.";
  } else {
    feedbackLKS = "✘ MASIH ADA KESALAHAN.\nCoba periksa kembali hasil pengukuran pada simulator.";
  }
}

// -------------------------------------------------------------------
// RAK ALAT UKUR & INTERAKSI MOUSE
// -------------------------------------------------------------------

function drawToolRack() {
  fill(248, 250, 252); stroke(203, 213, 225); strokeWeight(1);
  rect(20, 345, 210, 220, 8);

  fill(71, 85, 105); noStroke(); textAlign(LEFT, TOP);
  textSize(11); textStyle(BOLD);
  text("🧰 RAK ALAT UKUR", 30, 355);

  if (!showVoltmeter) {
    fill(254, 243, 199); stroke(245, 158, 11); strokeWeight(1);
    rect(35, 380, 50, 28, 4);
    fill(15, 23, 42); noStroke(); rect(40, 385, 40, 14, 2);
    fill(217, 119, 6); textSize(9); textStyle(BOLD);
    text("V", 95, 390);
  }

  if (!showAmmeter) {
    fill(224, 242, 254); stroke(2, 132, 199); strokeWeight(1);
    circle(60, 440, 30);
    fill(15, 23, 42); noStroke(); circle(60, 440, 22);
    fill(2, 132, 199); textSize(9); textStyle(BOLD);
    text("A", 95, 435);
  }
}

function toggleVoltmeter() {
  showVoltmeter = !showVoltmeter;
  if (showVoltmeter) {
    voltmeter.x = 340; voltmeter.y = 180;
    btnVoltToggle.html('↩ Simpan Voltmeter');
    btnVoltToggle.style('background-color', '#FEF2F2');
    btnVoltToggle.style('color', '#991B1B');
    btnVoltToggle.style('border-color', '#EF4444');
  } else {
    btnVoltToggle.html('📌 Ambil Voltmeter');
    btnVoltToggle.style('background-color', '#FEF3C7');
    btnVoltToggle.style('color', '#92400E');
    btnVoltToggle.style('border-color', '#F59E0B');
  }
}

function toggleAmmeter() {
  showAmmeter = !showAmmeter;
  if (showAmmeter) {
    ammeter.x = 380; ammeter.y = 180;
    btnAmpToggle.html('↩ Simpan Amperemeter');
    btnAmpToggle.style('background-color', '#FEF2F2');
    btnAmpToggle.style('color', '#991B1B');
    btnAmpToggle.style('border-color', '#EF4444');
  } else {
    btnAmpToggle.html('📌 Ambil Amperemeter');
    btnAmpToggle.style('background-color', '#E0F2FE');
    btnAmpToggle.style('color', '#075985');
    btnAmpToggle.style('border-color', '#0284C7');
  }
}

function drawDraggableVoltmeter(val) {
  push();
  translate(voltmeter.x, voltmeter.y);
  stroke(220, 38, 38); strokeWeight(2); line(-20, 20, -35, 45); fill(220, 38, 38); circle(-35, 45, 6);
  stroke(30, 41, 59); strokeWeight(2); line(20, 20, 35, 45); fill(30, 41, 59); circle(35, 45, 6);
  stroke(217, 119, 6); strokeWeight(2); fill(254, 243, 199); rect(-40, -22, 80, 44, 8);
  fill(15, 23, 42); noStroke(); rect(-32, -15, 64, 22, 4);
  fill(52, 211, 153); textAlign(CENTER, CENTER); textSize(11); textStyle(BOLD); text(`${val.toFixed(1)} V`, 0, -4);
  fill(180, 83, 9); textSize(8); text("VOLTMETER", 0, 13);
  pop();
}

function drawDraggableAmmeter(val) {
  push();
  translate(ammeter.x, ammeter.y);
  stroke(2, 132, 199); strokeWeight(2.5); fill(224, 242, 254); circle(0, 0, 48);
  fill(15, 23, 42); noStroke(); circle(0, 0, 36);
  fill(56, 189, 248); textAlign(CENTER, CENTER); textSize(10); textStyle(BOLD); text(`${val.toFixed(2)} A`, 0, -3);
  fill(2, 132, 199); textSize(7); text("AMPERE", 0, 9);
  pop();
}

function mouseDragged() {
  if (currentPage === 2) {
    if (voltmeter.isDragging) {
      voltmeter.x = constrain(mouseX - voltmeter.offsetX, 270, 1040); voltmeter.y = constrain(mouseY - voltmeter.offsetY, 20, 250);
    }
    if (ammeter.isDragging) {
      ammeter.x = constrain(mouseX - ammeter.offsetX, 270, 1040); ammeter.y = constrain(mouseY - ammeter.offsetY, 20, 250);
    }
  }
}

function mouseReleased() {
  voltmeter.isDragging = false;
  ammeter.isDragging = false;
}

// -------------------------------------------------------------------
// VISUALISASI SKEMA RANGKAIAN
// -------------------------------------------------------------------

function drawSeriesVisual(V, R1, R2, I1, I2, active) {
  stroke(71, 85, 105); strokeWeight(4); noFill();
  let kx = 440, ky = 70, kw = 440, kh = 160;
  rect(kx, ky, kw, kh, 12);

  drawBattery(kx - 30, ky + kh / 2, V);
  drawGlowBulb(kx + 140, ky, I1, `Lampu 1 (${R1}Ω)`);
  drawGlowBulb(kx + 300, ky, I2, `Lampu 2 (${R2}Ω)`);

  if (active) drawLoopDots(kx, ky, kw, kh, offsetTotal);
}

function drawParallelVisual(V, R1, R2, I1, I2, active) {
  stroke(71, 85, 105); strokeWeight(4); noFill();
  let kx1 = 440, kx2 = 880;
  let ky1 = 70, ky2 = 150, ky3 = 230;

  line(kx1, ky1, kx1, ky3); line(kx1, ky3, kx2, ky3); line(kx2, ky3, kx2, ky1);
  line(kx1, ky1, kx2, ky1); line(kx1, ky2, kx2, ky2);

  drawBattery(kx1 - 30, (ky1 + ky3) / 2, V);

  let bulbX = (kx1 + kx2) / 2;
  drawGlowBulb(bulbX, ky1, I1, `L1 (${R1}Ω)`);
  drawGlowBulb(bulbX, ky2, I2, `L2 (${R2}Ω)`);

  fill(2, 132, 199); noStroke();
  circle(kx1, ky1, 8); circle(kx1, ky2, 8); circle(kx2, ky1, 8); circle(kx2, ky2, 8);

  if (active) {
    drawLinearDots(kx2, ky3, kx1, ky3, offsetTotal); drawLinearDots(kx1, ky3, kx1, ky2, offsetTotal);
    drawLinearDots(kx1, ky2, kx1, ky1, offset1); drawLinearDots(kx1, ky1, kx2, ky1, offset1); drawLinearDots(kx2, ky1, kx2, ky2, offset1);
    drawLinearDots(kx1, ky2, kx2, ky2, offset2);
    drawLinearDots(kx2, ky2, kx2, ky3, offsetTotal);
  }
}

// -------------------------------------------------------------------
// PANEL GRAFIK & METRIK
// -------------------------------------------------------------------

function drawDetailedLiveGraph(x, y, w, h, currentV, currentI) {
  fill(255); stroke(226, 232, 240); strokeWeight(1);
  rect(x, y, w, h, 10);

  fill(30, 41, 59); noStroke(); textAlign(LEFT, TOP); textSize(12); textStyle(BOLD);
  text("📈 GRAFIK REAL-TIME: ARUS (I) TERHADAP TEGANGAN (V)", x + 16, y + 14);

  let gx = x + 55, gy = y + 42, gw = w - 85, gh = h - 75;

  stroke(241, 245, 249); strokeWeight(1);
  for (let i = 1; i <= 3; i++) line(gx, gy + (gh / 4) * i, gx + gw, gy + (gh / 4) * i);
  for (let i = 1; i <= 5; i++) line(gx + (gw / 6) * i, gy, gx + (gw / 6) * i, gy + gh);

  stroke(100, 116, 139); strokeWeight(1.5);
  line(gx, gy + gh, gx + gw, gy + gh); line(gx, gy, gx, gy + gh);

  fill(100, 116, 139); noStroke(); textAlign(RIGHT, CENTER); textSize(9); textStyle(NORMAL);
  text("4.0A", gx - 8, gy); text("2.0A", gx - 8, gy + gh / 2); text("0.0A", gx - 8, gy + gh);

  push(); translate(gx - 32, gy + gh / 2); rotate(-HALF_PI);
  textAlign(CENTER, CENTER); textSize(10); textStyle(BOLD); fill(2, 132, 199);
  text("Arus I (A)", 0, 0); pop();

  textAlign(CENTER, TOP); textSize(9); textStyle(NORMAL); fill(100, 116, 139);
  text("Waktu / Sampel Kontinu", gx + gw / 2, gy + gh + 12);

  noStroke(); fill(2, 132, 199, 25);
  beginShape(); vertex(gx, gy + gh);
  for (let i = 0; i < graphHistory.length; i++) {
    let px = map(i, 0, 60, gx, gx + gw);
    let py = map(graphHistory[i].i, 0, 4.0, gy + gh, gy); py = constrain(py, gy, gy + gh);
    vertex(px, py);
  }
  vertex(gx + gw, gy + gh); endShape(CLOSE);

  stroke(2, 132, 199); strokeWeight(2.5); noFill();
  beginShape();
  for (let i = 0; i < graphHistory.length; i++) {
    let px = map(i, 0, 60, gx, gx + gw);
    let py = map(graphHistory[i].i, 0, 4.0, gy + gh, gy); py = constrain(py, gy, gy + gh);
    vertex(px, py);
  }
  endShape();

  if (graphHistory.length > 0) {
    let lastIdx = graphHistory.length - 1;
    let lastX = map(lastIdx, 0, 60, gx, gx + gw);
    let lastY = map(graphHistory[lastIdx].i, 0, 4.0, gy + gh, gy); lastY = constrain(lastY, gy, gy + gh);

    fill(2, 132, 199); stroke(255); strokeWeight(2); circle(lastX, lastY, 10);
    fill(15, 23, 42); noStroke(); rect(lastX - 45, lastY - 26, 50, 18, 4);
    fill(255); textAlign(CENTER, CENTER); textSize(9); textStyle(BOLD);
    text(`${currentI.toFixed(2)}A`, lastX - 20, lastY - 17);
  }
}

function drawGlowBulb(x, y, current, label) {
  push(); translate(x, y);
  let brightness = constrain(map(current, 0, 2.5, 0, 255), 0, 255);
  if (brightness > 5) {
    noStroke();
    for (let r = 45; r > 15; r -= 6) {
      fill(245, 158, 11, map(r, 15, 45, brightness * 0.3, 0)); circle(0, 0, r * 2);
    }
  }
  stroke(100, 116, 139); strokeWeight(2); fill(254, 243, 199, 160 + brightness * 0.3); circle(0, 0, 36);
  stroke(217, 119, 6); strokeWeight(2.5); noFill();
  beginShape(); vertex(-6, 4); vertex(-3, -8); vertex(0, -3); vertex(3, -8); vertex(6, 4); endShape();
  fill(30, 41, 59); noStroke(); textAlign(CENTER, TOP); textSize(11); textStyle(BOLD); text(label, 0, 24);
  pop();
}

function drawBattery(x, y, v) {
  push(); translate(x, y);
  stroke(100, 116, 139); strokeWeight(2); fill(241, 245, 249); rect(-25, -30, 50, 60, 6);
  fill(224, 242, 254); stroke(186, 230, 253); rect(-20, -20, 40, 22, 4);
  fill(3, 105, 161); noStroke(); textAlign(CENTER, CENTER); textSize(10); textStyle(BOLD); text(`${v}V`, 0, -9);
  fill(71, 85, 105); textSize(10); text("BATERAI", 0, 15);
  pop();
}

function drawMetricCard(x, y, w, h, title, value, formula, colorHex) {
  fill(255); stroke(226, 232, 240); strokeWeight(1); rect(x, y, w, h, 10);
  fill(100, 116, 139); noStroke(); textAlign(LEFT, TOP); textSize(10); textStyle(BOLD); text(title, x + 16, y + 16);
  fill(colorHex); textSize(24); text(value, x + 16, y + 38);
  fill(148, 163, 184); textSize(11); textStyle(NORMAL); text(formula, x + 16, y + 82);
}

function drawStatusBadge(x, y, current, active) {
  push();
  if (!active) {
    fill(254, 226, 226); stroke(248, 113, 113); rect(x, y, 170, 30, 20);
    fill(220, 38, 38); noStroke(); textAlign(CENTER, CENTER); textSize(11); textStyle(BOLD); text("🚫 SAKELAR OFF", x + 85, y + 15);
  } else if (current > 3.0) {
    fill(254, 243, 199); stroke(251, 191, 36); rect(x, y, 170, 30, 20);
    fill(180, 83, 9); noStroke(); textAlign(CENTER, CENTER); textSize(11); textStyle(BOLD); text("⚠ BEBAN TINGGI", x + 85, y + 15);
  } else {
    fill(209, 250, 229); stroke(52, 211, 153); rect(x, y, 170, 30, 20);
    fill(4, 120, 87); noStroke(); textAlign(CENTER, CENTER); textSize(11); textStyle(BOLD); text("✔ RANGKAIAN AMAN", x + 85, y + 15);
  }
  pop();
}

function drawTheoryPanel(x, y, w, h, mode, I1, I2, R1, R2) {
  fill(255); stroke(226, 232, 240); strokeWeight(1); rect(x, y, w, h, 10);
  fill(30, 41, 59); noStroke(); textAlign(LEFT, TOP); textSize(12); textStyle(BOLD); text("ANALISIS CABANG", x + 16, y + 14);
  textSize(11); textStyle(NORMAL); fill(71, 85, 105);
  if (mode === 'seri') {
    text(`• Tegangan L1 (V1): ${(I1 * R1).toFixed(1)} V\n` +
         `• Tegangan L2 (V2): ${(I2 * R2).toFixed(1)} V\n\n` +
         `Pada Rangkaian Seri, arus di setiap komponen selalu SAMA, tetapi tegangan terbagi.`, x + 16, y + 42, w - 30, h - 50);
  } else {
    text(`• Arus Cabang 1 (I1): ${I1.toFixed(2)} A\n` +
         `• Arus Cabang 2 (I2): ${I2.toFixed(2)} A\n\n` +
         `Hukum Kirchhoff I:\nI_total = I1 + I2\n(${ (I1+I2).toFixed(2) } A = ${I1.toFixed(2)} A + ${I2.toFixed(2)} A)`, x + 16, y + 42, w - 30, h - 50);
  }
}

// HELPER ANIMASI
function drawLoopDots(x, y, w, h, offset) {
  fill(217, 119, 6); noStroke();
  let perimeter = 2 * (w + h); let step = 32;
  for (let p = 0; p < perimeter; p += step) {
    let pos = (p + offset) % perimeter; let px, py;
    if (pos < w) { px = x + pos; py = y; }
    else if (pos < w + h) { px = x + w; py = y + (pos - w); }
    else if (pos < 2 * w + h) { px = x + w - (pos - (w + h)); py = y + h; }
    else { px = x; py = y + h - (pos - (2 * w + h)); }
    circle(px, py, 6);
  }
}

function drawLinearDots(x1, y1, x2, y2, offset) {
  fill(217, 119, 6); noStroke();
  let len = dist(x1, y1, x2, y2); let step = 26;
  for (let d = 0; d < len; d += step) {
    let pos = (d + offset) % len; let t = pos / len;
    let px = lerp(x1, x2, t); let py = lerp(y1, y2, t);
    circle(px, py, 5);
  }
}

function toggleSwitch() {
  switchState = !switchState;
  if (switchState) {
    btnToggleSwitch.html('⚡ SAKELAR: ON'); btnToggleSwitch.style('background-color', '#059669');
  } else {
    btnToggleSwitch.html('🛑 SAKELAR: OFF'); btnToggleSwitch.style('background-color', '#DC2626');
  }
}

function styleSlider(elt) {
  elt.style('width', '200px'); elt.style('accent-color', '#0284C7');
}

function styleRadio(elt) {
  elt.style('color', '#334155'); elt.style('font-size', '12px');
}