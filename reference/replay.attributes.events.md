# 1. `scopes` (object)

## 1.0. Common objects

In each common object, the `object.attrid` is the object value's name and `object.namespace`
is the `mapNamespace`. For brievity, these values are not repeated.

Since **Heroes of the Storm** is a 5v5 (total 10 players) game, the `scopes` object contains
10 (ten) common objects, `1` through, and including, `10`.  There is an additional `16` object
under `scopes`.

## 1.0.1 `500` (array(object(int attrid, int namespace, string value)))

### 1.0.1.1 `value` (string)

* `Humn` - Human player
* `Comp` - AI

## 1.0.2 `2002` through `2024` (array(object(int attrid, int namespace, string value)))

### 1.0.2.1 `value` (string)

* `T1`
* `T2`
* `T3`
* `T4`
* `T8`
* `T9`

## 1.0.3 `3002` (array(object(int attrid, int namespace, string value)))

### 1.0.3.1 `value` (string)

* `tc01` through `tc10`

## 1.0.4 `3003` (array(object(int attrid, int namespace, string value)))

### 1.0.4.1 `value` (string)

* ` 100`

## 1.0.5 `3004` (array(object(int attrid, int namespace, string value)))

### 1.0.5.1 `value` (string)

* `VyEy`
* `VyHd`
* `Medi`
* `HdVH`

## 1.0.6 `3007` (array(object(int attrid, int namespace, string value)))

### 1.0.6.1 `value` (string)

* `Part`

## 1.0.7 `3008` (array(object(int attrid, int namespace, string value)))

### 1.0.7.1 `value` (string)

* `Obs`

## 1.0.8 `3011` (array(object(int attrid, int namespace, string value)))

### 1.0.8.1 `value` (string)

* `   0`

## 1.0.9 `3012` (array(object(int attrid, int namespace, string value)))

### 1.0.9.1 `value` (string)

* ` 22`

## 1.0.10 `4001` (array(object(int attrid, int namespace, string value)))

### 1.0.10.1 `value` (string)

* `no`
* `yes`

## 1.0.11 `4002` (array(object(int attrid, int namespace, string value)))

### 1.0.11.1 `value` (string)

Hero played.

* `null` - Blank??
* `Abat` - Abathur
* `Anub` - Anub'arak
* `Arth` - Arthas
* `Arts` - Artanis
* `Azmo` - Azmodan
* `Barb` - Sonya
* `Butc` - The Butcher
* `CCho` - Cho
* `Chen` - Chen
* `Crus` - Johanna
* `Demo`
* `Diab` - Diablo
* `Drya` - Lunara
* `Faer` - Brightwing
* `Fals` - Falstad
* `Gall` - Gall
* `Genn`
* `Illi` - Illidan
* `Jain` - Jaina
* `Kael` - Kael'thas
* `Kerr` - Kerrigan
* `L90E`
* `Leor` - Leoric
* `LiLi` - Li Li
* `Lost` - The Lost Vikings
* `Malf` - Malfurion
* `Medi` - Lt. Morales
* `Monk` - Kharazim
* `Mura` - Muradin
* `Murk` - Murky
* `Nova` - Nova
* `Rand`
* `Rayn` - Raynor
* `Rehg` - Rehgar
* `Rexx` - Rexxar
* `Sgth` - Sgt. Hammer
* `Stit` - Stitches
* `Sylv` - Sylvanas
* `Tass` - Tassadar
* `Thra` - Thrall
* `Tink` - Gazlowe
* `Tych` - Tychus
* `Tyrd` - Tyrande (Hehe, "tyrd")
* `Tyrl` - Tyrael
* `Uthe` - Uther
* `Witc` - Nazeebo
* `Zaga` - Zagara
* `Zera` - Zeratul

## 1.0.12 `4003` (array(object(int attrid, int namespace, string value)))

### 1.0.12.1 `value` (string)

* `null` - Default skin and coloring
* `AAL1`
* `AAL2`
* `AAL3`
* `Aba1`
* `Aba2`
* `Aba3`
* `Aba4`
* `Aba5`
* `Aba6`
* `Aba7`
* `Aba9`
* `AbaA`
* `AbaB`
* `AbaC`
* `AgD1`
* `AgD2`
* `AgD3`
* `Anu1`
* `Anu2`
* `Anu3`
* `Anu4`
* `Anu5`
* `AnU6`
* `AnU7`
* `AnU8`
* `Art1`
* `Art2`
* `Art6`
* `Art7`
* `Art8`
* `Art9`
* `ArtA`
* `ArtB`
* `ArtC`
* `ArtD`
* `ArtE`
* `AzA1`
* `AzA2`
* `AzA3`
* `Azm1`
* `Azm2`
* `Azm3`
* `AzU1`
* `AzU2`
* `AzU3`
* `Bar1`
* `Bar2`
* `Bar3`
* `Bar4`
* `Bar5`
* `Bar6`
* `Bar7`
* `Bar8`
* `Bri1`
* `Bri2`
* `BrL1`
* `BrL2`
* `BrL3`
* `BrU1`
* `BrU2`
* `BrU3`
* `BuI1`
* `BuI2`
* `BuI3`
* `But1`
* `But2`
* `BuU1`
* `BuU2`
* `BuU3`
* `CGU0`
* `CGU1`
* `CGU2`
* `ChC0`
* `ChC1`
* `ChC2`
* `Chn1`
* `Chn2`
* `Chn3`
* `Chn4`
* `Chn5`
* `Cho1`
* `Cho2`
* `ChU1`
* `ChU2`
* `ChU3`
* `ChW1`
* `ChW2`
* `ChW3`
* `CrC1`
* `CrC2`
* `CrC3`
* `Cru1`
* `Cru2`
* `Dem1`
* `Dem2`
* `Dem3`
* `Dem4`
* `Dem5`
* `Dem7`
* `Dem8`
* `Dem9`
* `Dhu1`
* `Dhu2`
* `Dhu3`
* `Dia1`
* `Dia2`
* `Dia3`
* `Dia4`
* `Dia5`
* `Dia6`
* `Dia7`
* `Dia8`
* `DiU1`
* `DiU2`
* `DiU3`
* `Dry1`
* `Dry2`
* `Dry3`
* `Dry4`
* `Dry5`
* `Dry7`
* `Dry8`
* `Etc2`
* `Etc3`
* `Etc4`
* `Etc5`
* `Etc6`
* `Etc7`
* `Etc8`
* `Etc9`
* `EtcA`
* `EtcB`
* `EtcC`
* `Fal1`
* `Fal2`
* `Fal3`
* `Fal4`
* `Fal5`
* `Fal6`
* `Fal7`
* `Fal8`
* `FlP1`
* `FlP2`
* `FlP3`
* `GaB1`
* `GaB2`
* `GaB3`
* `GaS1`
* `GaS2`
* `GaS3`
* `GaU1`
* `GaU2`
* `GaU3`
* `GG01`
* `GG02`
* `GGC0`
* `GGC1`
* `GGC2`
* `GGU1`
* `Gru1`
* `Gru2`
* `Gru3`
* `Ill1`
* `Ill2`
* `Ill3`
* `Ill4`
* `Ill5`
* `Ill6`
* `Ill7`
* `Ill8`
* `Ill9`
* `IllA`
* `IllB`
* `Jai1`
* `Jai2`
* `Jai3`
* `Jai4`
* `Jai5`
* `Jai6`
* `Jai7`
* `Jai8`
* `JaM1`
* `JaM2`
* `JaM3`
* `JaU2`
* `JaU3`
* `Kae1`
* `Kae2`
* `KaU1`
* `KaU2`
* `KaU3`
* `KeC1`
* `KeC2`
* `KeC3`
* `Ker1`
* `Ker2`
* `Ker3`
* `Ker4`
* `Ker5`
* `Ker6`
* `Ker7`
* `Ker8`
* `Leo1`
* `Leo2`
* `LeS1`
* `LeS2`
* `LeU1`
* `LeU2`
* `LeU3`
* `LeV1`
* `LeV2`
* `LeV3`
* `Lil1`
* `Lil2`
* `Lil3`
* `Lil4`
* `Lil5`
* `LiU2`
* `LiU3`
* `LLu1`
* `LLu2`
* `LLu3`
* `Lvk2`
* `Lvk3`
* `Lvk4`
* `Lvk5`
* `Lvk6`
* `Lvk7`
* `Lvk8`
* `Lvk9`
* `MaB1`
* `MaB2`
* `MaB3`
* `Mal1`
* `Mal2`
* `Mal3`
* `Mal4`
* `Mal5`
* `Mal6`
* `MaM1`
* `MaM2`
* `MaM3`
* `MaU1`
* `MaU2`
* `MaU3`
* `MeA1`
* `MeA2`
* `MeA3`
* `Med1`
* `Med2`
* `MeU2`
* `MeU3`
* `Mky1`
* `Mky2`
* `Mky3`
* `Mky4`
* `Mky5`
* `Mky6`
* `Mky7`
* `Mky8`
* `Mnk1`
* `Mnk2`
* `Mon1`
* `Mon2`
* `Mon3`
* `Mur1`
* `Mur2`
* `Mur3`
* `Mur4`
* `Mur5`
* `Mur6`
* `Mur7`
* `Mur8`
* `MuU1`
* `MuU2`
* `MuU3`
* `NoU1`
* `NoU2`
* `NoU3`
* `Nov1`
* `Nov2`
* `Nov3`
* `Nov4`
* `Nov5`
* `Nov6`
* `Nov7`
* `Nov8`
* `NoZ1`
* `NoZ2`
* `NoZ3`
* `RaM1`
* `RaM2`
* `RaM3`
* `RaU1`
* `RaU2`
* `RaU3`
* `Ray1`
* `Ray2`
* `Ray3`
* `Ray4`
* `Ray5`
* `Ray6`
* `Ray7`
* `Ray8`
* `Reh1`
* `Reh2`
* `Reh3`
* `Reh4`
* `Reh5`
* `ReI1`
* `ReI2`
* `ReI3`
* `ReU1`
* `ReU2`
* `ReU3`
* `Rtn2`
* `Rtn3`
* `Rtn4`
* `Rtn5`
* `Rtn6`
* `RxF2`
* `RxF3`
* `RxFr`
* `RxM1`
* `Rxr1`
* `Rxr2`
* `Sgt1`
* `Sgt2`
* `Sgt3`
* `Sgt4`
* `Sgt5`
* `Sgt7`
* `Sgt8`
* `Sgt9`
* `SgtA`
* `SgtB`
* `SHE1`
* `SHE2`
* `SHE3`
* `SPK1`
* `SPK2`
* `SPK3`
* `StB1`
* `StB2`
* `Sti1`
* `Sti2`
* `Sti3`
* `Sti4`
* `Sti5`
* `Sti6`
* `Sti7`
* `Sti8`
* `StU1`
* `StU2`
* `StU3`
* `StW1`
* `StW2`
* `StW3`
* `SuS1`
* `SuS2`
* `SuS3`
* `SyF1`
* `SyF2`
* `SyF3`
* `Syl1`
* `Syl2`
* `Syl3`
* `Syl4`
* `Syl5`
* `Tas1`
* `Tas2`
* `Tas3`
* `Tas4`
* `Tas5`
* `Tas6`
* `Tas7`
* `Tas8`
* `Tas9`
* `TasA`
* `TasB`
* `TasC`
* `TEB1`
* `TEB2`
* `TEB3`
* `Thr2`
* `Thr3`
* `Thr4`
* `Thr5`
* `Thr6`
* `Thr7`
* `Thr8`
* `Thr9`
* `Tin1`
* `Tin2`
* `Tyc1`
* `Tyc2`
* `Tyc3`
* `Tyc4`
* `Tyc5`
* `Tyc6`
* `Tyc7`
* `Tyc8`
* `Tyc9`
* `TycA`
* `TycB`
* `Tyd1`
* `Tyd2`
* `Tyd3`
* `Tyd4`
* `Tyd5`
* `Tyd6`
* `Tyd7`
* `Tyd8`
* `TydA`
* `TydB`
* `TydC`
* `Tyl1`
* `Tyl2`
* `Tyl3`
* `Tyl4`
* `Tyl5`
* `Tyl6`
* `Tyl7`
* `Tyl8`
* `TyU1`
* `TyU2`
* `TyU3`
* `UCr1`
* `UCr2`
* `UCr3`
* `URt1`
* `URt2`
* `URt3`
* `Uth1`
* `Uth2`
* `Uth3`
* `Uth4`
* `Uth5`
* `Uth6`
* `Uth7`
* `Uth8`
* `Uth9`
* `UthA`
* `UthC`
* `UtU1`
* `UtU2`
* `UtU3`
* `WDH1`
* `WDH2`
* `WDH3`
* `WDU1`
* `WDU2`
* `WDU3`
* `Wit1`
* `Wit2`
* `Wit3`
* `Wit4`
* `Wit5`
* `Zag1`
* `Zag2`
* `Zag3`
* `Zag4`
* `Zag5`
* `Zag6`
* `Zag7`
* `Zag8`
* `ZaI1`
* `ZaI2`
* `ZaI3`
* `Zer1`
* `Zer2`
* `Zer3`
* `Zer4`
* `Zer5`
* `Zer6`
* `Zer7`
* `Zer8`
* `ZerA`
* `ZerB`
* `ZerC`
* `ZeU1`
* `ZeU2`
* `ZeU3`


## 1.0.14 `4004` (array(object(int attrid, int namespace, string value)))

### 1.0.14.1 `value` (string)

Mount and coloring

* `null`
* `AnWg`
* `Arm1`
* `Arm2`
* `ArmH`
* `AzFF`
* `BaB1`
* `BaB2`
* `BaB3`
* `BBB1`
* `BBB2`
* `BBB3`
* `BBN1`
* `BBN2`
* `BBN3`
* `BGo1`
* `BGo2`
* `BGo3`
* `BhDb`
* `C9N0`
* `C9N1`
* `C9N2`
* `Car1`
* `Car2`
* `Car3`
* `CKBF`
* `Cyb1`
* `Cyb2`
* `Cyb3`
* `Cyb4`
* `Cyb5`
* `Cybe`
* `DiDb`
* `Dir1`
* `Dir2`
* `Dire`
* `Diru`
* `FEL0`
* `FEL1`
* `FEL2`
* `Goa1`
* `Goa2`
* `Goa3`
* `Hhh1`
* `Hhh2`
* `Hhh3`
* `Hor1`
* `Hor2`
* `Hors`
* `Hrt1`
* `Hrt2`
* `Hrt3`
* `Idir`
* `Idr1`
* `Idr2`
* `JUH1`
* `JUH2`
* `JUH3`
* `LIO0`
* `LIO1`
* `LIO2`
* `Mal1`
* `Mal2`
* `Mal3`
* `Mpi1`
* `Mpi2`
* `Mpig`
* `Mrh1`
* `Mrh2`
* `Mrh3`
* `MTMF`
* `Nxc1`
* `Nxc2`
* `Nxc3`
* `Nzb1`
* `Nzb2`
* `Nzbr`
* `QAr1`
* `QArH`
* `QHh4`
* `QHh5`
* `QHoA`
* `QHot`
* `QJU4`
* `QJU6`
* `QMa4`
* `QMa6`
* `QMr4`
* `QMr5`
* `QNx4`
* `QNzs`
* `QRa3`
* `QRa4`
* `QRao`
* `QTyi`
* `Rai1`
* `Rai2`
* `Rain`
* `RDR1`
* `RDR2`
* `RDR3`
* `Spi1`
* `Spi2`
* `Spi3`
* `STA1`
* `TGW0`
* `Tig1`
* `Tig2`
* `Tigr`
* `Til1`
* `Til2`
* `Tilu`
* `TrG2`
* `TrG3`
* `TrGo`
* `TyC2`
* `TyC3`
* `TyCh`
* `VSp1`
* `VSp2`
* `VSp3`
* `Vul1`
* `Vul2`
* `Vul3`
* `Zaga`
* `ZgDb`

## 1.0.15 `4005` (array(object(int attrid, int namespace, string value)))

### 1.0.15.1 `value` (string)

* `yes`
* `no`

## 1.0.16 `4006` (array(object(int attrid, int namespace, string value)))

### 1.0.16.1 `value` (string)

* `rang` - Ranged
* `mele` - Melee
* `null`

## 1.0.17 `4007` (array(object(int attrid, int namespace, string value)))

### 1.0.17.1 `value` (string)

* `assa` - Assassin
* `spec` - Specialist
* `supp` - Support
* `warr` - Warrior


## 1.0.18 `4008` (array(object(int attrid, int namespace, string value)))

### 1.0.18.1 `value` (string)

* `   1`
* `   2`
* `   3`
* `   4`
* `   5`
* `   6`
* `   7`
* `   8`
* `   9`
* `  10`
* `  11`
* `  12`
* `  13`
* `  14`
* `  15`
* `  16`
* `  17`
* `  18`
* `  19`
* `  20`

## 1.0.19 `4009` (array(object(int attrid, int namespace, string value)))

### 1.0.19.1 `value` (string)

* `yes`
* `no`
