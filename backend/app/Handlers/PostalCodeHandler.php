<?php

namespace App\Handlers;

use App\Models\City;
use App\Models\PostalCode;
use App\Models\Province;
use App\Repositories\PostalCodeRepository;
use Illuminate\Support\Facades\Http;

class PostalCodeHandler
{
    public function __construct(private PostalCodeRepository $postalCodes) {}

    // Listar todos los códigos postales.
    public function list(): array
    {
        return $this->postalCodes->all();
    }

    // Obtener códigos postales por ciudad.
    public function getByCity(int $cityId): array
    {
        return $this->postalCodes->PostalCodesByCity($cityId);
    }

    public function searchByCode(string $code)
    {
        return $this->postalCodes->findByCodeWithLocation($code);
    }

    /**
     * Busca el CP en la DB local. Si no existe, consulta api.zippopotam.us,
     * crea Provincia → Ciudad → CP bajo demanda y devuelve el registro con relaciones.
     */
    public function lookupOrCreate(string $code): ?PostalCode
    {
        $existing = $this->postalCodes->findByCodeWithLocation($code);
        if ($existing) return $existing;

        $response = Http::timeout(5)->get("https://api.zippopotam.us/es/{$code}");

        if (!$response->ok()) return null;

        $places = $response->json('places');
        if (empty($places)) return null;

        $place      = $places[0];
        $cityName   = $place['place name'];
        $stateName  = $place['state'];
        $stateCode  = $place['state abbreviation'] ?? '';

        $province = Province::firstOrCreate(
            ['name' => $stateName],
            ['code' => $stateCode]
        );

        $city = City::firstOrCreate(
            ['name' => $cityName, 'province_id' => $province->id]
        );

        $postalCode = PostalCode::firstOrCreate(
            ['code' => $code],
            ['city_id' => $city->id]
        );

        return $postalCode->load('city.province');
    }
}
