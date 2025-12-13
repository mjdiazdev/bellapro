<?php

namespace App\Handlers;

use App\Repositories\PostalCodeRepository;

class PostalCodeHandler
{
    public function __construct(private PostalCodeRepository $postalCodes) {}

    // Listar todos los códigos postales.
    public function list(): array
    {
        return $this->postalCodes->all();
    }
}
