<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Handlers\CategoryHandler;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $handler = app(CategoryHandler::class);

        $nombres = [
            14 => 'Catorce', 15 => 'Quince', 16 => 'Dieciséis', 17 => 'Diecisiete',
            18 => 'Dieciocho', 19 => 'Diecinueve', 20 => 'Veinte', 21 => 'Veintiuno',
            22 => 'Veintidós', 23 => 'Veintitrés', 24 => 'Veinticuatro', 25 => 'Veinticinco',
            26 => 'Veintiséis', 27 => 'Veintisiete', 28 => 'Veintiocho', 29 => 'Veintinueve',
            30 => 'Treinta',
            31 => 'Treinta y uno', 32 => 'Treinta y dos', 33 => 'Treinta y tres',
            34 => 'Treinta y cuatro', 35 => 'Treinta y cinco', 36 => 'Treinta y seis',
            37 => 'Treinta y siete', 38 => 'Treinta y ocho', 39 => 'Treinta y nueve',
            40 => 'Cuarenta',
            41 => 'Cuarenta y uno', 42 => 'Cuarenta y dos', 43 => 'Cuarenta y tres',
            44 => 'Cuarenta y cuatro', 45 => 'Cuarenta y cinco', 46 => 'Cuarenta y seis',
            47 => 'Cuarenta y siete', 48 => 'Cuarenta y ocho', 49 => 'Cuarenta y nueve',
            50 => 'Cincuenta',
            51 => 'Cincuenta y uno', 52 => 'Cincuenta y dos', 53 => 'Cincuenta y tres',
            54 => 'Cincuenta y cuatro', 55 => 'Cincuenta y cinco', 56 => 'Cincuenta y seis',
            57 => 'Cincuenta y siete', 58 => 'Cincuenta y ocho', 59 => 'Cincuenta y nueve',
            60 => 'Sesenta',
            61 => 'Sesenta y uno', 62 => 'Sesenta y dos', 63 => 'Sesenta y tres',
            64 => 'Sesenta y cuatro', 65 => 'Sesenta y cinco', 66 => 'Sesenta y seis',
            67 => 'Sesenta y siete', 68 => 'Sesenta y ocho', 69 => 'Sesenta y nueve',
            70 => 'Setenta',
            71 => 'Setenta y uno', 72 => 'Setenta y dos', 73 => 'Setenta y tres',
            74 => 'Setenta y cuatro', 75 => 'Setenta y cinco', 76 => 'Setenta y seis',
            77 => 'Setenta y siete', 78 => 'Setenta y ocho', 79 => 'Setenta y nueve',
            80 => 'Ochenta',
            81 => 'Ochenta y uno', 82 => 'Ochenta y dos', 83 => 'Ochenta y tres',
            84 => 'Ochenta y cuatro', 85 => 'Ochenta y cinco', 86 => 'Ochenta y seis',
            87 => 'Ochenta y siete', 88 => 'Ochenta y ocho', 89 => 'Ochenta y nueve',
            90 => 'Noventa',
            91 => 'Noventa y uno', 92 => 'Noventa y dos', 93 => 'Noventa y tres',
            94 => 'Noventa y cuatro', 95 => 'Noventa y cinco', 96 => 'Noventa y seis',
            97 => 'Noventa y siete', 98 => 'Noventa y ocho', 99 => 'Noventa y nueve',
            100 => 'Cien',
            101 => 'Ciento uno', 102 => 'Ciento dos', 103 => 'Ciento tres',
            104 => 'Ciento cuatro', 105 => 'Ciento cinco', 106 => 'Ciento seis',
            107 => 'Ciento siete', 108 => 'Ciento ocho', 109 => 'Ciento nueve',
            110 => 'Ciento diez', 111 => 'Ciento once', 112 => 'Ciento doce',
            113 => 'Ciento trece', 114 => 'Ciento catorce', 115 => 'Ciento quince',
            116 => 'Ciento dieciséis', 117 => 'Ciento diecisiete', 118 => 'Ciento dieciocho',
            119 => 'Ciento diecinueve', 120 => 'Ciento veinte',
            121 => 'Ciento veintiuno', 122 => 'Ciento veintidós', 123 => 'Ciento veintitrés',
            124 => 'Ciento veinticuatro', 125 => 'Ciento veinticinco', 126 => 'Ciento veintiséis',
            127 => 'Ciento veintisiete', 128 => 'Ciento veintiocho', 129 => 'Ciento veintinueve',
            130 => 'Ciento treinta',
            131 => 'Ciento treinta y uno', 132 => 'Ciento treinta y dos',
            133 => 'Ciento treinta y tres', 134 => 'Ciento treinta y cuatro',
            135 => 'Ciento treinta y cinco', 136 => 'Ciento treinta y seis',
            137 => 'Ciento treinta y siete', 138 => 'Ciento treinta y ocho',
            139 => 'Ciento treinta y nueve', 140 => 'Ciento cuarenta',
            141 => 'Ciento cuarenta y uno', 142 => 'Ciento cuarenta y dos',
            143 => 'Ciento cuarenta y tres', 144 => 'Ciento cuarenta y cuatro',
            145 => 'Ciento cuarenta y cinco', 146 => 'Ciento cuarenta y seis',
            147 => 'Ciento cuarenta y siete', 148 => 'Ciento cuarenta y ocho',
            149 => 'Ciento cuarenta y nueve', 150 => 'Ciento cincuenta',
            151 => 'Ciento cincuenta y uno', 152 => 'Ciento cincuenta y dos',
            153 => 'Ciento cincuenta y tres', 154 => 'Ciento cincuenta y cuatro',
            155 => 'Ciento cincuenta y cinco', 156 => 'Ciento cincuenta y seis',
            157 => 'Ciento cincuenta y siete', 158 => 'Ciento cincuenta y ocho',
            159 => 'Ciento cincuenta y nueve', 160 => 'Ciento sesenta',
            161 => 'Ciento sesenta y uno', 162 => 'Ciento sesenta y dos',
            163 => 'Ciento sesenta y tres', 164 => 'Ciento sesenta y cuatro',
            165 => 'Ciento sesenta y cinco', 166 => 'Ciento sesenta y seis',
            167 => 'Ciento sesenta y siete', 168 => 'Ciento sesenta y ocho',
            169 => 'Ciento sesenta y nueve', 170 => 'Ciento setenta',
            171 => 'Ciento setenta y uno', 172 => 'Ciento setenta y dos',
            173 => 'Ciento setenta y tres', 174 => 'Ciento setenta y cuatro',
            175 => 'Ciento setenta y cinco', 176 => 'Ciento setenta y seis',
            177 => 'Ciento setenta y siete', 178 => 'Ciento setenta y ocho',
            179 => 'Ciento setenta y nueve', 180 => 'Ciento ochenta',
            181 => 'Ciento ochenta y uno', 182 => 'Ciento ochenta y dos',
            183 => 'Ciento ochenta y tres', 184 => 'Ciento ochenta y cuatro',
            185 => 'Ciento ochenta y cinco', 186 => 'Ciento ochenta y seis',
            187 => 'Ciento ochenta y siete', 188 => 'Ciento ochenta y ocho',
            189 => 'Ciento ochenta y nueve', 190 => 'Ciento noventa',
            191 => 'Ciento noventa y uno', 192 => 'Ciento noventa y dos',
            193 => 'Ciento noventa y tres', 194 => 'Ciento noventa y cuatro',
            195 => 'Ciento noventa y cinco', 196 => 'Ciento noventa y seis',
            197 => 'Ciento noventa y siete', 198 => 'Ciento noventa y ocho',
            199 => 'Ciento noventa y nueve', 200 => 'Doscientos',
            201 => 'Doscientos uno', 202 => 'Doscientos dos', 203 => 'Doscientos tres',
            204 => 'Doscientos cuatro', 205 => 'Doscientos cinco', 206 => 'Doscientos seis',
            207 => 'Doscientos siete', 208 => 'Doscientos ocho',
        ];

        foreach ($nombres as $codigo => $nombre) {
            try {
                $handler->create([
                    'name' => $nombre,
                    'code' => (string) $codigo,
                ]);
                echo "✓ Creada: {$nombre} (código: {$codigo})\n";
            } catch (\Exception $e) {
                echo "✗ Saltada: {$nombre} (código: {$codigo}) — {$e->getMessage()}\n";
            }
        }
    }
}
