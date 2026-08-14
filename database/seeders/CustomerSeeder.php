<?php

namespace Database\Seeders;

use App\Models\Customer;
use Illuminate\Database\Seeder;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        $branches = [
            'Addis Ababa Main', 'Bole', 'Merkato', 'Piassa', 'Kazanchis',
            'CMC', 'Bishoftu', 'Bahir Dar', 'Hawassa', 'Dire Dawa',
        ];

        $customers = [
            ['importer_name' => 'Ethio Import Export PLC', 'branch' => 'Addis Ababa Main', 'nbe_account_no' => 'NBE-AA001', 'tin_number' => '1000-0001-1234', 'status' => 'active'],
            ['importer_name' => 'Bole Trading House', 'branch' => 'Bole', 'nbe_account_no' => 'NBE-BL001', 'tin_number' => '1000-0002-5678', 'status' => 'active'],
            ['importer_name' => 'Merkato General Trading', 'branch' => 'Merkato', 'nbe_account_no' => 'NBE-MK001', 'tin_number' => '1000-0003-9012', 'status' => 'active'],
            ['importer_name' => 'Piassa Wholesale Corp', 'branch' => 'Piassa', 'nbe_account_no' => 'NBE-PS001', 'tin_number' => '1000-0004-3456', 'status' => 'active'],
            ['importer_name' => 'Kazanchis Auto Import', 'branch' => 'Kazanchis', 'nbe_account_no' => 'NBE-KZ001', 'tin_number' => '1000-0005-7890', 'status' => 'active'],
            ['importer_name' => 'CMC Electronics Ltd', 'branch' => 'CMC', 'nbe_account_no' => 'NBE-CM001', 'tin_number' => '1000-0006-2345', 'status' => 'active'],
            ['importer_name' => 'Bishoftu Agricultural Supplies', 'branch' => 'Bishoftu', 'nbe_account_no' => 'NBE-BS001', 'tin_number' => '1000-0007-6789', 'status' => 'active'],
            ['importer_name' => 'Bahir Dar Textile Importers', 'branch' => 'Bahir Dar', 'nbe_account_no' => 'NBE-BD001', 'tin_number' => '1000-0008-0123', 'status' => 'active'],
            ['importer_name' => 'Hawassa Coffee Exporters', 'branch' => 'Hawassa', 'nbe_account_no' => 'NBE-HW001', 'tin_number' => '1000-0009-4567', 'status' => 'active'],
            ['importer_name' => 'Dire Dawa Logistics PLC', 'branch' => 'Dire Dawa', 'nbe_account_no' => 'NBE-DD001', 'tin_number' => '1000-0010-8901', 'status' => 'active'],
            ['importer_name' => 'Addis Pharma Importers', 'branch' => 'Addis Ababa Main', 'nbe_account_no' => 'NBE-AA002', 'tin_number' => '1000-0011-2345', 'status' => 'active'],
            ['importer_name' => 'Bole Construction Materials', 'branch' => 'Bole', 'nbe_account_no' => 'NBE-BL002', 'tin_number' => '1000-0012-6789', 'status' => 'active'],
            ['importer_name' => 'Merkato Food Importers', 'branch' => 'Merkato', 'nbe_account_no' => 'NBE-MK002', 'tin_number' => '1000-0013-0123', 'status' => 'active'],
            ['importer_name' => 'Piassa Furniture Trading', 'branch' => 'Piassa', 'nbe_account_no' => 'NBE-PS002', 'tin_number' => '1000-0014-4567', 'status' => 'active'],
            ['importer_name' => 'Kazanchis Machinery Import', 'branch' => 'Kazanchis', 'nbe_account_no' => 'NBE-KZ002', 'tin_number' => '1000-0015-8901', 'status' => 'active'],
            ['importer_name' => 'CMC IT Solutions Import', 'branch' => 'CMC', 'nbe_account_no' => 'NBE-CM002', 'tin_number' => '1000-0016-2345', 'status' => 'active'],
            ['importer_name' => 'Bishoftu Livestock Trading', 'branch' => 'Bishoftu', 'nbe_account_no' => 'NBE-BS002', 'tin_number' => '1000-0017-6789', 'status' => 'active'],
            ['importer_name' => 'Bahir Dar Spice Exporters', 'branch' => 'Bahir Dar', 'nbe_account_no' => 'NBE-BD002', 'tin_number' => '1000-0018-0123', 'status' => 'active'],
            ['importer_name' => 'Hawassa Fish Trading PLC', 'branch' => 'Hawassa', 'nbe_account_no' => 'NBE-HW002', 'tin_number' => '1000-0019-4567', 'status' => 'active'],
            ['importer_name' => 'Dire Dawa Industrial Supply', 'branch' => 'Dire Dawa', 'nbe_account_no' => 'NBE-DD002', 'tin_number' => '1000-0020-8901', 'status' => 'active'],
            ['importer_name' => 'Sunshine General Trading', 'branch' => 'Addis Ababa Main', 'nbe_account_no' => 'NBE-AA003', 'tin_number' => '1000-0021-1234', 'status' => 'inactive'],
            ['importer_name' => 'Highland Beverages Import', 'branch' => 'Bole', 'nbe_account_no' => 'NBE-BL003', 'tin_number' => '1000-0022-5678', 'status' => 'inactive'],
            ['importer_name' => 'Green Valley Agro Import', 'branch' => 'Merkato', 'nbe_account_no' => 'NBE-MK003', 'tin_number' => '1000-0023-9012', 'status' => 'inactive'],
            ['importer_name' => 'Blue Nile Trading PLC', 'branch' => 'Bahir Dar', 'nbe_account_no' => 'NBE-BD003', 'tin_number' => '1000-0024-3456', 'status' => 'active'],
            ['importer_name' => 'Rift Valley General Import', 'branch' => 'Hawassa', 'nbe_account_no' => 'NBE-HW003', 'tin_number' => '1000-0025-7890', 'status' => 'active'],
        ];

        foreach ($customers as $customer) {
            Customer::create($customer);
        }
    }
}
