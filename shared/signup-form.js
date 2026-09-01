/**
 * Signup form — cascading location selects & password toggles.
 */
(function () {
  'use strict';

  var LOCATION_DATA = {
    dhaka: {
      districts: {
        dhaka: ['Dhanmondi', 'Gulshan', 'Uttara', 'Mirpur', 'Mohammadpur', 'Tejgaon', 'Ramna', 'Motijheel'],
        gazipur: ['Tongi', 'Kaliakair', 'Kapasia', 'Sreepur', 'Kaliganj'],
        narayanganj: ['Narayanganj Sadar', 'Bandar', 'Rupganj', 'Sonargaon', 'Araihazar'],
        narsingdi: ['Narsingdi Sadar', 'Belabo', 'Monohardi', 'Palash', 'Raipura', 'Shibpur'],
        manikganj: ['Manikganj Sadar', 'Singair', 'Saturia', 'Harirampur', 'Ghior', 'Shibalaya', 'Daulatpur'],
        tangail: ['Tangail Sadar', 'Sakhipur', 'Basail', 'Madhupur', 'Ghatail', 'Kalihati', 'Nagarpur', 'Mirzapur', 'Gopalpur', 'Delduar', 'Bhuapur', 'Dhanbari']
      }
    },
    chattogram: {
      districts: {
        chattogram: ['Kotwali', 'Panchlaish', 'Halishahar', 'Pahartali', 'Double Mooring', 'Bandar', 'Chandgaon'],
        coxsbazar: ['Cox\'s Bazar Sadar', 'Teknaf', 'Ukhiya', 'Ramu', 'Chakaria', 'Maheshkhali', 'Pekua', 'Kutubdia'],
        comilla: ['Comilla Sadar', 'Barura', 'Brahmanpara', 'Burichang', 'Chandina', 'Chauddagram', 'Daudkandi', 'Debidwar'],
        feni: ['Feni Sadar', 'Chhagalnaiya', 'Daganbhuiyan', 'Parshuram', 'Sonagazi', 'Fulgazi']
      }
    },
    rajshahi: {
      districts: {
        rajshahi: ['Boalia', 'Rajpara', 'Motihar', 'Shah Makhdum', 'Chandrima', 'Bagha', 'Bagmara', 'Charghat'],
        bogura: ['Bogura Sadar', 'Sherpur', 'Shibganj', 'Dhunat', 'Dhupchanchia', 'Gabtali', 'Kahaloo', 'Nandigram'],
        pabna: ['Pabna Sadar', 'Ishwardi', 'Bera', 'Bhangura', 'Chatmohar', 'Faridpur', 'Santhia', 'Sujanagar']
      }
    },
    khulna: {
      districts: {
        khulna: ['Khalishpur', 'Daulatpur', 'Sonadanga', 'Khan Jahan Ali', 'Dighalia', 'Phultala', 'Rupsha', 'Terokhada'],
        jessore: ['Jessore Sadar', 'Abhaynagar', 'Bagherpara', 'Chaugachha', 'Jhikargachha', 'Keshabpur', 'Manirampur', 'Sharsha'],
        satkhira: ['Satkhira Sadar', 'Assasuni', 'Debhata', 'Kalaroa', 'Kaliganj', 'Tala', 'Shyamnagar']
      }
    },
    sylhet: {
      districts: {
        sylhet: ['Sylhet Sadar', 'South Surma', 'Zindabazar', 'Airport', 'Beanibazar', 'Bishwanath', 'Balaganj', 'Companiganj'],
        moulvibazar: ['Moulvibazar Sadar', 'Barlekha', 'Juri', 'Kamalganj', 'Kulaura', 'Rajnagar', 'Sreemangal'],
        habiganj: ['Habiganj Sadar', 'Ajmiriganj', 'Baniachong', 'Bahubal', 'Chunarughat', 'Lakhai', 'Madhabpur', 'Nabiganj']
      }
    },
    barishal: {
      districts: {
        barishal: ['Barishal Sadar', 'Bakerganj', 'Banaripara', 'Gaurnadi', 'Agailjhara', 'Mehendiganj', 'Muladi', 'Wazirpur'],
        patuakhali: ['Patuakhali Sadar', 'Bauphal', 'Dashmina', 'Galachipa', 'Kalapara', 'Mirzaganj', 'Rangabali', 'Dumki'],
        bhola: ['Bhola Sadar', 'Burhanuddin', 'Char Fasson', 'Daulatkhan', 'Lalmohan', 'Manpura', 'Tazumuddin']
      }
    },
    rangpur: {
      districts: {
        rangpur: ['Rangpur Sadar', 'Badarganj', 'Gangachara', 'Kaunia', 'Mithapukur', 'Pirgachha', 'Pirganj', 'Taraganj'],
        dinajpur: ['Dinajpur Sadar', 'Birampur', 'Birganj', 'Bochaganj', 'Chirirbandar', 'Phulbari', 'Ghoraghat', 'Hakimpur'],
        kurigram: ['Kurigram Sadar', 'Bhurungamari', 'Char Rajibpur', 'Chilmari', 'Phulbari', 'Rajarhat', 'Raumari', 'Ulipur']
      }
    },
    mymensingh: {
      districts: {
        mymensingh: ['Mymensingh Sadar', 'Bhaluka', 'Trishal', 'Haluaghat', 'Muktagachha', 'Dhobaura', 'Fulbaria', 'Gaffargaon'],
        jamalpur: ['Jamalpur Sadar', 'Baksiganj', 'Dewanganj', 'Islampur', 'Madarganj', 'Melandaha', 'Sarishabari'],
        netrokona: ['Netrokona Sadar', 'Atpara', 'Barhatta', 'Durgapur', 'Khaliajuri', 'Kendua', 'Madan', 'Mohanganj', 'Purbadhala']
      }
    }
  };

  function slugify(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  function toOptions(items) {
    return items.map(function (name) {
      return { value: slugify(name), label: name };
    });
  }

  function getDistrictOptions(division) {
    var div = LOCATION_DATA[division];
    if (!div) return [];
    return Object.keys(div.districts).map(function (key) {
      return { value: key, label: formatDistrictLabel(key) };
    });
  }

  function getThanaOptions(division, district) {
    var div = LOCATION_DATA[division];
    if (!div || !div.districts[district]) return [];
    return toOptions(div.districts[district]);
  }

  function formatDistrictLabel(key) {
    var labels = {
      dhaka: 'Dhaka', gazipur: 'Gazipur', narayanganj: 'Narayanganj', narsingdi: 'Narsingdi',
      manikganj: 'Manikganj', tangail: 'Tangail', chattogram: 'Chattogram', coxsbazar: "Cox's Bazar",
      comilla: 'Comilla', feni: 'Feni', rajshahi: 'Rajshahi', bogura: 'Bogura', pabna: 'Pabna',
      khulna: 'Khulna', jessore: 'Jessore', satkhira: 'Satkhira', sylhet: 'Sylhet',
      moulvibazar: 'Moulvibazar', habiganj: 'Habiganj', barishal: 'Barishal', patuakhali: 'Patuakhali',
      bhola: 'Bhola', rangpur: 'Rangpur', dinajpur: 'Dinajpur', kurigram: 'Kurigram',
      mymensingh: 'Mymensingh', jamalpur: 'Jamalpur', netrokona: 'Netrokona'
    };
    return labels[key] || key.charAt(0).toUpperCase() + key.slice(1);
  }

  function initPasswordToggles() {
    document.querySelectorAll('[data-toggle-password]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var input = document.getElementById(btn.getAttribute('data-toggle-password'));
        if (!input) return;
        var icon = btn.querySelector('.material-symbols-outlined');
        if (input.type === 'password') {
          input.type = 'text';
          icon.textContent = 'visibility_off';
          btn.setAttribute('aria-label', 'Hide password');
        } else {
          input.type = 'password';
          icon.textContent = 'visibility';
          btn.setAttribute('aria-label', 'Show password');
        }
      });
    });
  }

  function initCascadingSelects(selects) {
    var zone = selects.get('zoneSelect');
    var region = selects.get('regionSelect');
    var territory = selects.get('territorySelect');

    if (!zone || !region || !territory) return;

    zone.root.addEventListener('change', function (e) {
      var division = e.detail.value;
      region.clear();
      territory.clear();
      territory.disable();

      if (!division) {
        region.disable();
        return;
      }

      region.setOptions(getDistrictOptions(division), true);
      region.enable();
    });

    region.root.addEventListener('change', function (e) {
      var division = zone.getValue();
      var district = e.detail.value;
      territory.clear();

      if (!division || !district) {
        territory.disable();
        return;
      }

      territory.setOptions(getThanaOptions(division, district), true);
      territory.enable();
    });
  }

  function init() {
    var selects = window.initSearchableSelects();
    var region = selects.get('regionSelect');
    var territory = selects.get('territorySelect');
    if (region) region.disable();
    if (territory) territory.disable();
    initCascadingSelects(selects);
    initPasswordToggles();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
