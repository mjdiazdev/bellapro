<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            margin: 10px;
            font-size: 12px;
        }

        h2 {
            text-align: center;
            margin-bottom: 20px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        td {
            width: 33%;
            text-align: center;
            padding: 10px;
            vertical-align: top;
        }

        .qr-box img {
            width: 140px;
            height: auto;
        }

        .label {
            font-weight: bold;
            margin-top: 5px;
        }

        .code {
            font-size: 11px;
        }
    </style>
</head>
<body>

<h2>Códigos QR de Categorías</h2>

<table>
    @foreach (array_chunk($categories->toArray(), 3) as $row)
        <tr>
            @foreach ($row as $cat)
                <td>
                    <div class="qr-box">
                        @if (!empty($cat['qr_url']))
                            <img src="{{ public_path('storage/'.$cat['qr_url']) }}" alt="QR">
                        @else
                            <p>No QR</p>
                        @endif
                    </div>

                    <div class="label">{{ $cat['name'] }}</div>
                    <div class="code">{{ $cat['code'] }}</div>
                </td>
            @endforeach

            {{-- Si una fila tiene menos de 3, rellenamos los espacios vacíos --}}
            @for ($i = count($row); $i < 3; $i++)
                <td></td>
            @endfor
        </tr>
    @endforeach
</table>

</body>
</html>
