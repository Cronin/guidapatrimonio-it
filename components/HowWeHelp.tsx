const services = [
  {
    number: '01',
    title: 'Analisi Patrimoniale',
    description: 'Mappiamo la tua situazione attuale: investimenti, immobili, debiti, assicurazioni e obiettivi di vita. Una fotografia completa per partire con il piede giusto.',
  },
  {
    number: '02',
    title: 'Strategia Personalizzata',
    description: 'Costruiamo insieme un piano su misura che tiene conto dei tuoi obiettivi, della tua tolleranza al rischio e del tuo orizzonte temporale.',
  },
  {
    number: '03',
    title: 'Implementazione',
    description: 'Ti guidiamo nell\'esecuzione della strategia, selezionando gli strumenti più efficienti e trasparenti disponibili sul mercato.',
  },
  {
    number: '04',
    title: 'Monitoraggio Continuo',
    description: 'Rivediamo periodicamente il piano, adattandolo ai cambiamenti della tua vita e del mercato. Siamo sempre al tuo fianco.',
  },
]

export default function HowWeHelp() {
  return (
    <section id="come-lavoriamo" className="section-lg bg-green-600 text-white">
      <div className="container-custom">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <p className="label text-green-200 mb-4">Come Lavoriamo</p>
          <h2 className="font-heading text-h3 text-white mb-6">
            Un percorso chiaro verso i tuoi obiettivi
          </h2>
          <p className="text-body-lg text-white/80">
            Il nostro metodo si basa su quattro fasi fondamentali, ognuna
            progettata per darti chiarezza e controllo sul tuo futuro finanziario.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="flex gap-6 p-8 rounded-card bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors"
            >
              <span className="font-heading text-h4-lg text-green-300 opacity-50">
                {service.number}
              </span>
              <div>
                <h3 className="font-body text-h4 text-white mb-3">
                  {service.title}
                </h3>
                <p className="text-body-md text-white/70">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
