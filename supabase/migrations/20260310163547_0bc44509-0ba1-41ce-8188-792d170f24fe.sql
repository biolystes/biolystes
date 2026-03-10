UPDATE contract_templates 
SET contenu_html = replace(
  contenu_html,
  '<p style="font-size: 13px; line-height: 1.8;">Les créations réalisées dans le cadre du présent contrat (logo, packaging, formules) restent la propriété du Client après paiement intégral des prestations.</p>',
  '<p style="font-size: 13px; line-height: 1.8;">Le site web e-commerce créé dans le cadre de la prestation est la propriété pleine et entière du Client dès sa mise en ligne. Aucun reliquat ni frais supplémentaire n''est dû pour en conserver la propriété.<br/><br/>Les créations réalisées dans le cadre du présent contrat (logo, packaging, formules, visuels) sont cédées au Client dès le paiement intégral de la prestation, sans restriction d''usage.</p>'
)
WHERE id = '58a456e1-178b-4963-a738-f4880e2db5d1';